#!/usr/bin/env node

/**
 * Circular Dependency Detector
 * 
 * Detects circular dependencies across packages in the monorepo.
 * 
 * Usage: node scripts/check-circular-deps.js
 * 
 * Exit codes:
 * 0 - No circular dependencies found
 * 1 - Circular dependencies found
 */

const fs = require('fs');
const path = require('path');

/**
 * Parse import/require statements from file content
 */
function parseImports(content, filePath) {
  const imports = new Set();
  
  // Match ES6 imports
  const importRegex = /import\s+(?:type\s+)?(?:[^'"]*\s+from\s+)?['"]([^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    imports.add(match[1]);
  }

  // Match require statements
  const requireRegex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  while ((match = requireRegex.exec(content)) !== null) {
    imports.add(match[1]);
  }

  // Match dynamic imports
  const dynamicImportRegex = /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  while ((match = dynamicImportRegex.exec(content)) !== null) {
    imports.add(match[1]);
  }

  return imports;
}

/**
 * Check if an import is an internal @wrelik package
 */
function isWrelikPackage(importPath) {
  return importPath.startsWith('@wrelik/');
}

/**
 * Get the package name from an import path
 */
function getPackageName(importPath) {
  // Handle scoped packages like @wrelik/auth/server
  const match = importPath.match(/^(@wrelik\/[^/]+)/);
  return match ? match[1] : null;
}

/**
 * Build dependency graph from packages
 */
function buildDependencyGraph(packagesDir) {
  const graph = new Map();
  const packages = fs.readdirSync(packagesDir).filter((dir) => {
    const packageJsonPath = path.join(packagesDir, dir, 'package.json');
    return fs.existsSync(packageJsonPath);
  });

  for (const pkg of packages) {
    const packageDir = path.join(packagesDir, pkg);
    const packageJsonPath = path.join(packageDir, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const packageName = packageJson.name;

    // Get dependencies from package.json
    const deps = new Set();
    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.peerDependencies,
    };

    for (const dep of Object.keys(allDeps)) {
      if (isWrelikPackage(dep)) {
        deps.add(dep);
      }
    }

    // Also scan source files for imports
    const srcDir = path.join(packageDir, 'src');
    if (fs.existsSync(srcDir)) {
      const srcFiles = getAllFiles(srcDir, '.ts');
      for (const srcFile of srcFiles) {
        const content = fs.readFileSync(srcFile, 'utf-8');
        const imports = parseImports(content, srcFile);
        for (const imp of imports) {
          if (isWrelikPackage(imp)) {
            const pkgName = getPackageName(imp);
            if (pkgName && pkgName !== packageName) {
              deps.add(pkgName);
            }
          }
        }
      }
    }

    graph.set(packageName, deps);
  }

  return graph;
}

/**
 * Get all files in a directory recursively
 */
function getAllFiles(dir, ext) {
  const files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getAllFiles(fullPath, ext));
    } else if (item.endsWith(ext)) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Detect cycles using DFS
 */
function detectCycles(graph) {
  const cycles = [];
  const visited = new Set();
  const recursionStack = new Set();
  const path = [];

  function dfs(node) {
    visited.add(node);
    recursionStack.add(node);
    path.push(node);

    const deps = graph.get(node) || new Set();
    for (const dep of deps) {
      if (!visited.has(dep)) {
        const cycle = dfs(dep);
        if (cycle) {
          return cycle;
        }
      } else if (recursionStack.has(dep)) {
        // Found a cycle
        const cycleStart = path.indexOf(dep);
        return path.slice(cycleStart).concat(dep);
      }
    }

    path.pop();
    recursionStack.delete(node);
    return null;
  }

  for (const [node] of graph) {
    if (!visited.has(node)) {
      const cycle = dfs(node);
      if (cycle) {
        cycles.push(cycle);
      }
    }
  }

  return cycles;
}

function main() {
  console.log('🔄 Checking for circular dependencies...\n');

  const packagesDir = path.join(__dirname, '..', 'packages');
  const graph = buildDependencyGraph(packagesDir);

  console.log('📦 Package dependency graph:');
  for (const [pkg, deps] of graph) {
    if (deps.size > 0) {
      console.log(`   ${pkg} → ${[...deps].join(', ')}`);
    }
  }
  console.log('');

  const cycles = detectCycles(graph);

  console.log('='.repeat(50));

  if (cycles.length > 0) {
    console.log('❌ Found circular dependencies:\n');
    for (const cycle of cycles) {
      console.log(`   ${cycle.join(' → ')}`);
    }
    console.log('\nCircular dependencies can cause:');
    console.log('   - Runtime errors');
    console.log('   - Bundle size issues');
    console.log('   - Difficult debugging');
    process.exit(1);
  } else {
    console.log('✅ No circular dependencies found!');
    process.exit(0);
  }
}

main();
