#!/usr/bin/env node

/**
 * Smoke Test - Validates import resolution for runtime packages
 *
 * This script tests that runtime export maps resolve correctly.
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_SUBPATHS = ['./server', './client', './shared', './package.json'];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function collectPackages(packagesDir) {
  return fs.readdirSync(packagesDir).filter((dir) => fs.existsSync(path.join(packagesDir, dir, 'package.json')));
}

function isRuntimePackage(packageJson) {
  return Array.isArray(packageJson.wrelik?.runtimes) && packageJson.wrelik.runtimes.length > 0;
}

function validateRuntimePackage(packageDir) {
  const errors = [];
  const warnings = [];
  const packageJson = readJson(path.join(packageDir, 'package.json'));
  const exportsField = packageJson.exports || {};

  if (Object.prototype.hasOwnProperty.call(exportsField, '.')) {
    errors.push('Root export "." is forbidden for runtime packages');
  }

  for (const subpath of REQUIRED_SUBPATHS) {
    if (!exportsField[subpath]) {
      errors.push(`Missing export: ${subpath}`);
      continue;
    }

    const exportEntry = exportsField[subpath];
    const filePath =
      typeof exportEntry === 'string' ? exportEntry : exportEntry.import || exportEntry.require || exportEntry.default;

    if (filePath) {
      const fullPath = path.join(packageDir, filePath);
      if (!fs.existsSync(fullPath)) {
        errors.push(`Export ${subpath} points to missing file: ${filePath}`);
      }
    }
  }

  const distDir = path.join(packageDir, 'dist');
  if (!fs.existsSync(distDir)) {
    warnings.push('No dist directory found - run build first');
  }

  return { errors, warnings };
}

function validateExportMapStructure(packageDir) {
  const errors = [];
  const packageJson = readJson(path.join(packageDir, 'package.json'));
  const exportsField = packageJson.exports || {};

  for (const [subpath, entry] of Object.entries(exportsField)) {
    if (typeof entry !== 'object') {
      continue;
    }

    if (!entry.types) {
      errors.push(`${subpath}: Missing "types" field in conditional export`);
    }

    if (!entry.import && !entry.require) {
      errors.push(`${subpath}: Missing "import" or "require" field`);
    }
  }

  return errors;
}

function main() {
  console.log('Running smoke tests for package exports...\n');

  const packagesDir = path.join(__dirname, '..', 'packages');
  const packages = collectPackages(packagesDir);

  let totalErrors = 0;
  let totalWarnings = 0;

  for (const pkg of packages) {
    const packageDir = path.join(packagesDir, pkg);
    const packageJson = readJson(path.join(packageDir, 'package.json'));
    const packageName = packageJson.name;

    if (!isRuntimePackage(packageJson)) {
      console.log(`- ${packageName}: skipped (non-runtime package)`);
      continue;
    }

    console.log(`- ${packageName}:`);

    const { errors, warnings } = validateRuntimePackage(packageDir);
    const structureErrors = validateExportMapStructure(packageDir);
    const allErrors = [...errors, ...structureErrors];

    if (allErrors.length > 0) {
      console.log('  errors:');
      for (const err of allErrors) {
        console.log(`    - ${err}`);
      }
      totalErrors += allErrors.length;
    }

    if (warnings.length > 0) {
      console.log('  warnings:');
      for (const warn of warnings) {
        console.log(`    - ${warn}`);
      }
      totalWarnings += warnings.length;
    }

    if (allErrors.length === 0 && warnings.length === 0) {
      console.log('  ok');
    }
  }

  console.log(`\nSummary: ${totalErrors} error(s), ${totalWarnings} warning(s)`);

  if (totalErrors > 0) {
    process.exit(1);
  }
}

main();
