#!/usr/bin/env node

/**
 * Bundle Scanner - Checks for forbidden Node modules in client bundles
 * 
 * This script scans built client bundles (dist files) for forbidden Node.js
 * modules that should never end up in client-side code.
 * 
 * Usage: node scripts/scan-bundles.js
 * 
 * Exit codes:
 * 0 - No violations found
 * 1 - Violations found
 */

const fs = require('fs');
const path = require('path');

// Node.js built-in modules that should never be in client bundles
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

// npm packages that are server-only and should never be in client bundles
const FORBIDDEN_SERVER_PACKAGES = [
  '@clerk/backend',
  '@sentry/node',
  'posthog-node',
  'inngest',
  'resend',
  'pg',
  'mysql',
  'mongodb',
  'ioredis',
  'redis',
];

// Server-only subpaths
const FORBIDDEN_SERVER_SUBPATHS = [
  '@wrelik/auth/server',
  '@wrelik/auth/next',
  '@wrelik/config/server',
  '@wrelik/analytics/server',
  '@wrelik/storage/server',
  '@wrelik/errors/server',
  '@wrelik/db/server',
  '@wrelik/email/server',
  '@wrelik/jobs/server',
];

// Patterns that indicate a require/import of forbidden modules
function createForbiddenPatterns(modules) {
  return modules.map((mod) => {
    const escaped = mod.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return {
      module: mod,
      // Match various import patterns
      patterns: [
        new RegExp(`require\\s*\\(\\s*['"\`]${escaped}['"\`]\\s*\\)`, 'g'),
        new RegExp(`from\\s*['"\`]${escaped}['"\`]`, 'g'),
        new RegExp(`import\\s*\\(\\s*['"\`]${escaped}['"\`]\\s*\\)`, 'g'),
        new RegExp(`import\\s+.*?\\s+from\\s*['"\`]${escaped}['"\`]`, 'g'),
      ],
    };
  });
}

// Client entrypoints to scan
const CLIENT_ENTRYPOINTS = [
  'react-native',
  'client',
  'browser',
  'shared',
];

function scanFile(filePath, content, forbiddenPatterns) {
  const violations = [];

  for (const { module, patterns } of forbiddenPatterns) {
    for (const pattern of patterns) {
      const matches = content.match(pattern);
      if (matches) {
        violations.push({
          file: filePath,
          module,
          matches: matches.length,
        });
      }
    }
  }

  return violations;
}

function shouldScanFile(fileName, packageDir) {
  // Only scan client-side entrypoints
  const baseName = path.basename(fileName, path.extname(fileName));
  return CLIENT_ENTRYPOINTS.includes(baseName);
}

function scanPackage(packageDir, forbiddenPatterns) {
  const violations = [];
  const distDir = path.join(packageDir, 'dist');

  if (!fs.existsSync(distDir)) {
    console.log(`  ⚠️  No dist directory found, skipping`);
    return violations;
  }

  const files = fs.readdirSync(distDir);

  for (const file of files) {
    if (!file.endsWith('.js') && !file.endsWith('.mjs')) {
      continue;
    }

    // Only scan client entrypoints
    const baseName = path.basename(file, path.extname(file));
    if (!CLIENT_ENTRYPOINTS.includes(baseName)) {
      continue;
    }

    const filePath = path.join(distDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileViolations = scanFile(filePath, content, forbiddenPatterns);

    violations.push(...fileViolations);
  }

  return violations;
}

function main() {
  console.log('🔍 Scanning bundles for forbidden Node modules...\n');

  const packagesDir = path.join(__dirname, '..', 'packages');
  const packages = fs.readdirSync(packagesDir).filter((dir) => {
    const packageJsonPath = path.join(packagesDir, dir, 'package.json');
    return fs.existsSync(packageJsonPath);
  });

  const allPatterns = createForbiddenPatterns([
    ...FORBIDDEN_NODE_MODULES,
    ...FORBIDDEN_SERVER_PACKAGES,
    ...FORBIDDEN_SERVER_SUBPATHS,
  ]);

  let totalViolations = 0;

  for (const pkg of packages) {
    const packageDir = path.join(packagesDir, pkg);
    const packageJsonPath = path.join(packageDir, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

    console.log(`📦 Scanning ${packageJson.name}...`);

    const violations = scanPackage(packageDir, allPatterns);

    if (violations.length > 0) {
      console.log(`  ❌ Found ${violations.length} violation(s):`);
      for (const v of violations) {
        console.log(`     - ${v.module} (${v.matches} matches in ${path.basename(v.file)})`);
      }
      totalViolations += violations.length;
    } else {
      console.log(`  ✅ No violations`);
    }
  }

  console.log('\n' + '='.repeat(50));

  if (totalViolations > 0) {
    console.log(`❌ Found ${totalViolations} violation(s) in client bundles`);
    console.log('\nThese modules should not be imported in client-side code.');
    console.log('Use server-only subpaths instead.');
    process.exit(1);
  } else {
    console.log('✅ All bundles are clean!');
    process.exit(0);
  }
}

main();
