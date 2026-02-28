#!/usr/bin/env node

/**
 * Bundle Scanner - Checks for forbidden modules in client bundles.
 *
 * Core runtime adapters must not reference server-only vendors or Node modules.
 * Platform wrappers may reference their wrapped SDKs but still may not reference
 * Wrelik server subpaths from client bundles.
 */

const fs = require('fs');
const path = require('path');

const FORBIDDEN_NODE_MODULES = [
  'fs',
  'net',
  'tls',
  'child_process',
  'cluster',
  'dgram',
  'dns',
  'readline',
  'repl',
  'vm',
  'worker_threads',
  'fs/promises',
];

const FORBIDDEN_SERVER_PACKAGES_FOR_CORE = [
  '@clerk/backend',
  '@clerk/nextjs',
  '@clerk/clerk-expo',
  '@sentry/node',
  '@sentry/nextjs',
  'posthog-node',
  'inngest',
  'resend',
  '@aws-sdk/client-s3',
  '@aws-sdk/s3-request-presigner',
  '@upstash/redis',
  '@upstash/ratelimit',
  'pg',
  'mysql',
  'mongodb',
  'ioredis',
  'redis',
];

const FORBIDDEN_SERVER_SUBPATHS = [
  '@wrelik/auth/server',
  '@wrelik/analytics/server',
  '@wrelik/config/server',
  '@wrelik/db/server',
  '@wrelik/email/server',
  '@wrelik/errors/server',
  '@wrelik/jobs/server',
  '@wrelik/storage/server',
  '@wrelik/clerk-next/server',
  '@wrelik/clerk-expo/server',
  '@wrelik/sentry-next/server',
  '@wrelik/upstash/server',
  '@wrelik/auth/next',
  '@wrelik/auth/react-native',
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function createForbiddenPatterns(modules) {
  return modules.map((mod) => {
    const escaped = mod.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return {
      module: mod,
      patterns: [
        new RegExp(`require\\s*\\(\\s*['"]${escaped}['"]\\s*\\)`, 'g'),
        new RegExp(`from\\s*['"]${escaped}['"]`, 'g'),
        new RegExp(`import\\s*\\(\\s*['"]${escaped}['"]\\s*\\)`, 'g'),
        new RegExp(`import\\s+.*?\\s+from\\s*['"]${escaped}['"]`, 'g'),
      ],
    };
  });
}

function scanFile(filePath, content, forbiddenPatterns) {
  const violations = [];

  for (const { module, patterns } of forbiddenPatterns) {
    for (const pattern of patterns) {
      const matches = content.match(pattern);
      if (matches) {
        violations.push({ file: filePath, module, matches: matches.length });
      }
    }
  }

  return violations;
}

function scanPackageClientDist(packageDir, forbiddenPatterns) {
  const violations = [];
  const clientDir = path.join(packageDir, 'dist', 'client');

  if (!fs.existsSync(clientDir)) {
    return { violations, warning: 'No client dist directory found, skipping' };
  }

  const stack = [clientDir];
  while (stack.length > 0) {
    const dir = stack.pop();
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
      const filePath = path.join(dir, file.name);
      if (file.isDirectory()) {
        stack.push(filePath);
        continue;
      }
      if (!file.name.endsWith('.js') && !file.name.endsWith('.mjs')) {
        continue;
      }

      const content = fs.readFileSync(filePath, 'utf-8');
      violations.push(...scanFile(filePath, content, forbiddenPatterns));
    }
  }

  return { violations };
}

function collectRuntimePackages() {
  const packagesDir = path.join(__dirname, '..', 'packages');
  return fs
    .readdirSync(packagesDir)
    .map((dir) => ({ dir, packageDir: path.join(packagesDir, dir), manifestPath: path.join(packagesDir, dir, 'package.json') }))
    .filter(({ manifestPath }) => fs.existsSync(manifestPath))
    .map(({ dir, packageDir, manifestPath }) => ({ dir, packageDir, packageJson: readJson(manifestPath) }))
    .filter(({ packageJson }) => Array.isArray(packageJson.wrelik?.runtimes) && packageJson.wrelik.runtimes.includes('client'));
}

function isPlatformWrapper(packageJson) {
  return packageJson.wrelik?.packageClass === 'platform-wrapper';
}

function main() {
  console.log('Scanning bundles for forbidden client-side modules...\n');

  const runtimePackages = collectRuntimePackages();
  const corePatterns = createForbiddenPatterns([
    ...FORBIDDEN_NODE_MODULES,
    ...FORBIDDEN_SERVER_PACKAGES_FOR_CORE,
    ...FORBIDDEN_SERVER_SUBPATHS,
  ]);
  const platformPatterns = createForbiddenPatterns([...FORBIDDEN_SERVER_SUBPATHS]);

  let totalViolations = 0;

  for (const { packageDir, packageJson } of runtimePackages) {
    const patterns = isPlatformWrapper(packageJson) ? platformPatterns : corePatterns;
    const kind = isPlatformWrapper(packageJson) ? 'platform-wrapper' : 'core-runtime';
    console.log(`- Scanning ${packageJson.name} (${kind})...`);

    const { violations, warning } = scanPackageClientDist(packageDir, patterns);

    if (warning) {
      console.log(`  warning: ${warning}`);
      continue;
    }

    if (violations.length > 0) {
      console.log(`  violations: ${violations.length}`);
      for (const v of violations) {
        console.log(`    - ${v.module} (${v.matches} matches in ${path.basename(v.file)})`);
      }
      totalViolations += violations.length;
    } else {
      console.log('  ok');
    }
  }

  console.log(`\nSummary: ${totalViolations} violation(s)`);

  if (totalViolations > 0) {
    process.exit(1);
  }
}

main();
