import { readFileSync } from 'node:fs';

const runtimePackages = {
  '@wrelik/auth': ['server', 'client', 'shared'],
  '@wrelik/analytics': ['server', 'client', 'shared'],
  '@wrelik/config': ['server', 'client', 'shared'],
  '@wrelik/db': ['server', 'shared'],
  '@wrelik/email': ['server', 'shared'],
  '@wrelik/errors': ['server', 'client', 'shared'],
  '@wrelik/jobs': ['server', 'shared'],
  '@wrelik/storage': ['server', 'client', 'shared'],
};

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

const errors = [];

for (const [packageName, runtimes] of Object.entries(runtimePackages)) {
  const packageDir = packageName.replace('@wrelik/', '');
  const path = `packages/${packageDir}/package.json`;
  const manifest = readJson(path);
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
