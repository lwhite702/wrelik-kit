import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const MANIFEST_FIELDS = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
  'pnpm',
  'resolutions',
  'overrides',
];

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function collectManifests() {
  const manifests = ['package.json'];
  for (const pkg of readdirSync('packages')) {
    manifests.push(join('packages', pkg, 'package.json'));
  }
  return manifests;
}

function scanObject(path, object, errors) {
  if (!object || typeof object !== 'object') {
    return;
  }

  for (const [name, specifier] of Object.entries(object)) {
    if (typeof specifier !== 'string') {
      continue;
    }

    if (specifier.startsWith('link:') || specifier.startsWith('file:') || specifier.endsWith('.tgz')) {
      errors.push(`${path}: dependency "${name}" uses forbidden specifier "${specifier}"`);
    }
  }
}

const errors = [];

for (const path of collectManifests()) {
  const manifest = readJson(path);
  for (const field of MANIFEST_FIELDS) {
    scanObject(path, manifest[field], errors);
  }
}

if (errors.length > 0) {
  console.error('Workspace integrity check failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('Workspace integrity check passed.');
