import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const runtimePackagesWithClient = [
  'analytics',
  'auth',
  'config',
  'errors',
  'storage',
];

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
  '@sentry/node',
  '@aws-sdk/client-s3',
  '@aws-sdk/s3-request-presigner',
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

for (const pkg of runtimePackagesWithClient) {
  const clientDistDir = join('packages', pkg, 'dist', 'client');
  if (!existsSync(clientDistDir)) {
    errors.push(`${clientDistDir}: missing client build output`);
    continue;
  }

  for (const file of walk(clientDistDir)) {
    const content = readFileSync(file, 'utf8');

    for (const mod of forbiddenModules) {
      if (content.includes(`'${mod}'`) || content.includes(`"${mod}"`)) {
        errors.push(`${file}: forbidden module reference "${mod}" found in client bundle`);
      }
    }

    const hasServerReference =
      /@wrelik\/[\w-]+\/server/.test(content) ||
      /from\s+['"].*\/server(['"]|\/)/.test(content) ||
      /require\(['"].*\/server(['"]|\/)/.test(content);

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
