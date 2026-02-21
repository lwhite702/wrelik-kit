#!/usr/bin/env node

/**
 * Smoke Test - Validates import resolution for all packages
 * 
 * This script tests that all export maps resolve correctly.
 * 
 * Usage: node scripts/smoke-test.js
 * 
 * Exit codes:
 * 0 - All imports resolve correctly
 * 1 - Import resolution errors found
 */

const fs = require('fs');
const path = require('path');

// Expected subpaths for each package type
const PACKAGE_CONFIGS = {
  '@wrelik/analytics': {
    expectedSubpaths: ['.', './server', './client', './shared', './react-native'],
    serverOnly: ['./server'],
    clientSafe: ['.', './client', './shared', './react-native'],
  },
  '@wrelik/auth': {
    expectedSubpaths: ['.', './server', './client', './shared', './next', './react-native'],
    serverOnly: ['./server', './next'],
    clientSafe: ['.', './client', './shared', './react-native'],
  },
  '@wrelik/config': {
    expectedSubpaths: ['.', './server', './client', './shared', './react-native'],
    serverOnly: ['./server'],
    clientSafe: ['.', './client', './shared', './react-native'],
  },
  '@wrelik/db': {
    expectedSubpaths: ['.', './server', './shared', './react-native'],
    serverOnly: ['.', './server'],
    clientSafe: ['./shared'],
  },
  '@wrelik/email': {
    expectedSubpaths: ['.', './server', './shared', './react-native'],
    serverOnly: ['.', './server'],
    clientSafe: ['./shared'],
  },
  '@wrelik/errors': {
    expectedSubpaths: ['.', './server', './client', './shared', './react-native'],
    serverOnly: ['./server'],
    clientSafe: ['.', './client', './shared', './react-native'],
  },
  '@wrelik/jobs': {
    expectedSubpaths: ['.', './server', './shared', './react-native'],
    serverOnly: ['.', './server'],
    clientSafe: ['./shared'],
  },
  '@wrelik/storage': {
    expectedSubpaths: ['.', './server', './client', './shared', './react-native'],
    serverOnly: ['./server'],
    clientSafe: ['.', './client', './shared', './react-native'],
  },
};

function validatePackage(packageDir, packageName) {
  const errors = [];
  const warnings = [];
  const config = PACKAGE_CONFIGS[packageName];

  if (!config) {
    return { errors: [], warnings: [`No config found for ${packageName}`] };
  }

  const packageJsonPath = path.join(packageDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const exports = packageJson.exports || {};

  // Check that all expected subpaths exist
  for (const subpath of config.expectedSubpaths) {
    if (!exports[subpath]) {
      errors.push(`Missing export: ${subpath}`);
      continue;
    }

    // Check that the exported file exists
    const exportEntry = exports[subpath];
    const filePath = typeof exportEntry === 'string' 
      ? exportEntry 
      : exportEntry.import || exportEntry.require || exportEntry.default;

    if (filePath) {
      const fullPath = path.join(packageDir, filePath);
      if (!fs.existsSync(fullPath)) {
        errors.push(`Export ${subpath} points to missing file: ${filePath}`);
      }
    }
  }

  // Check that dist files exist for all exports
  const distDir = path.join(packageDir, 'dist');
  if (!fs.existsSync(distDir)) {
    warnings.push('No dist directory found - run build first');
  }

  return { errors, warnings };
}

function validateExportMapStructure(packageDir, packageName) {
  const errors = [];
  const packageJsonPath = path.join(packageDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const exports = packageJson.exports || {};

  // Check that conditional exports are properly structured
  for (const [subpath, entry] of Object.entries(exports)) {
    if (typeof entry === 'object') {
      // Check for required types field
      if (!entry.types) {
        errors.push(`${subpath}: Missing "types" field in conditional export`);
      }
      
      // Check for import/require
      if (!entry.import && !entry.require) {
        errors.push(`${subpath}: Missing "import" or "require" field`);
      }
    }
  }

  return errors;
}

function main() {
  console.log('🧪 Running smoke tests for package exports...\n');

  const packagesDir = path.join(__dirname, '..', 'packages');
  const packages = fs.readdirSync(packagesDir).filter((dir) => {
    const packageJsonPath = path.join(packagesDir, dir, 'package.json');
    return fs.existsSync(packageJsonPath);
  });

  let totalErrors = 0;
  let totalWarnings = 0;

  for (const pkg of packages) {
    const packageDir = path.join(packagesDir, pkg);
    const packageJsonPath = path.join(packageDir, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const packageName = packageJson.name;

    // Skip tooling packages
    if (packageName === '@wrelik/eslint-config' || packageName === '@wrelik/tsconfig') {
      console.log(`📦 ${packageName}: ✅ Skipped (tooling package)`);
      continue;
    }

    console.log(`📦 ${packageName}:`);

    // Validate package
    const { errors, warnings } = validatePackage(packageDir, packageName);
    const structureErrors = validateExportMapStructure(packageDir, packageName);
    const allErrors = [...errors, ...structureErrors];

    if (allErrors.length > 0) {
      console.log('  ❌ Errors:');
      for (const err of allErrors) {
        console.log(`     - ${err}`);
      }
      totalErrors += allErrors.length;
    }

    if (warnings.length > 0) {
      console.log('  ⚠️  Warnings:');
      for (const warn of warnings) {
        console.log(`     - ${warn}`);
      }
      totalWarnings += warnings.length;
    }

    if (allErrors.length === 0 && warnings.length === 0) {
      console.log('  ✅ All exports valid');
    }
  }

  console.log('\n' + '='.repeat(50));

  if (totalErrors > 0) {
    console.log(`❌ Found ${totalErrors} error(s)`);
    process.exit(1);
  } else {
    console.log('✅ All smoke tests passed!');
    if (totalWarnings > 0) {
      console.log(`⚠️  ${totalWarnings} warning(s)`);
    }
    process.exit(0);
  }
}

main();
