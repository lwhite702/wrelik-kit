import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function collectRuntimePackagesWithClient() {
  const core = [];
  const platformWrappers = [];

  for (const dir of readdirSync('packages')) {
    const manifestPath = join('packages', dir, 'package.json');
    if (!existsSync(manifestPath)) {
      continue;
    }

    const manifest = readJson(manifestPath);
    const runtimes = manifest.wrelik?.runtimes;
    if (!Array.isArray(runtimes) || !runtimes.includes('client')) {
      continue;
    }

    const packageClass = manifest.wrelik?.packageClass === 'platform-wrapper' ? 'platform-wrapper' : 'core';
    const item = { dir, name: manifest.name };
    if (packageClass === 'platform-wrapper') {
      platformWrappers.push(item);
    } else {
      core.push(item);
    }
  }

  return { core, platformWrappers };
}

const forbiddenModules = [
  'assert',
  'buffer',
  'child_process',
  'crypto',
  'dotenv',
  'fs',
  'http',
  'https',
  'inngest',
  'module',
  'net',
  'os',
  'path',
  'posthog-node',
  'resend',
  'stream',
  'tls',
  'url',
  'util',
  'vm',
  'worker_threads',
  'zlib',
  '@clerk/backend',
  '@clerk/nextjs',
  '@clerk/clerk-expo',
  '@sentry/node',
  '@sentry/nextjs',
  '@aws-sdk/client-s3',
  '@aws-sdk/s3-request-presigner',
  '@upstash/redis',
  '@upstash/ratelimit',
  '@upstash/qstash',
].flatMap((name) => (name.startsWith('@') ? [name] : [name, `node:${name}`]));

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      files.push(...walk(fullPath));
      continue;
    }

    if (fullPath.endsWith('.js') || fullPath.endsWith('.mjs')) {
      files.push(fullPath);
    }
  }
  return files;
}

const errors = [];
const { core: coreRuntimePackages, platformWrappers } = collectRuntimePackagesWithClient();

for (const pkg of [...coreRuntimePackages, ...platformWrappers]) {
  const clientDistDir = join('packages', pkg.dir, 'dist', 'client');
  if (!existsSync(clientDistDir)) {
    errors.push(`${clientDistDir}: missing client build output`);
    continue;
  }

  for (const file of walk(clientDistDir)) {
    const content = readFileSync(file, 'utf8');

    if (!platformWrappers.some((wrapper) => wrapper.dir === pkg.dir)) {
      for (const mod of forbiddenModules) {
        if (content.includes(`'${mod}'`) || content.includes(`"${mod}"`)) {
          errors.push(`${file}: forbidden module reference "${mod}" found in client bundle`);
        }
      }
    }

    const hasServerReference =
      /from\s+['"]@wrelik\/[\w-]+\/server['"]/.test(content) ||
      /require\(['"]@wrelik\/[\w-]+\/server['"]\)/.test(content) ||
      /import\(['"]@wrelik\/[\w-]+\/server['"]\)/.test(content);

    if (hasServerReference) {
      errors.push(`${file}: server runtime reference found in client bundle`);
    }
  }
}

if (errors.length > 0) {
  console.error('Bundle boundary check failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('Bundle boundary check passed.');
