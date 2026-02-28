import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function collectRuntimePackages() {
  const packagesDir = 'packages';
  const manifests = [];

  for (const dir of readdirSync(packagesDir)) {
    const path = join(packagesDir, dir, 'package.json');
    const manifest = readJson(path);
    const runtimes = manifest.wrelik?.runtimes;

    if (!Array.isArray(runtimes) || runtimes.length === 0) {
      continue;
    }

    manifests.push({ path, manifest, runtimes });
  }

  return manifests;
}

const errors = [];

for (const { path, manifest, runtimes } of collectRuntimePackages()) {
  const exportsField = manifest.exports ?? {};
  const runtimeMeta = manifest.wrelik?.runtimes ?? [];

  if (manifest.sideEffects !== false) {
    errors.push(`${path}: sideEffects must be false`);
  }

  if (JSON.stringify(runtimeMeta) !== JSON.stringify(runtimes)) {
    errors.push(`${path}: wrelik.runtimes must be exactly ${JSON.stringify(runtimes)}`);
  }

  if (Object.prototype.hasOwnProperty.call(exportsField, '.')) {
    errors.push(`${path}: root export "." is forbidden`);
  }

  const allowedExports = new Set(runtimes.map((runtime) => `./${runtime}`).concat('./package.json'));
  for (const key of Object.keys(exportsField)) {
    if (!allowedExports.has(key)) {
      errors.push(`${path}: unexpected export key "${key}"`);
    }
  }

  for (const runtime of runtimes) {
    const subpath = `./${runtime}`;
    const entry = exportsField[subpath];
    if (!entry || typeof entry !== 'object') {
      errors.push(`${path}: missing export entry ${subpath}`);
      continue;
    }

    const expected = {
      types: `./dist/${runtime}/index.d.ts`,
      import: `./dist/${runtime}/index.mjs`,
      require: `./dist/${runtime}/index.js`,
    };

    for (const [condition, value] of Object.entries(expected)) {
      if (entry[condition] !== value) {
        errors.push(`${path}: export ${subpath}.${condition} must be "${value}"`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error('Runtime contract check failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('Runtime contract check passed.');
