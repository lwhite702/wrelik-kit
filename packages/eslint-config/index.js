/**
 * @wrelik/eslint-config
 * 
 * Shared ESLint configuration for Wrelik projects.
 * Enforces vendor SDK boundaries and server/client separation.
 */

/**
 * Server-only packages that should never be imported in client code
 */
const serverOnlyPackages = [
  '@wrelik/db',
  '@wrelik/email',
  '@wrelik/jobs',
];

/**
 * Server-only subpaths that should never be imported in client code
 */
const serverOnlySubpaths = [
  '@wrelik/auth/server',
  '@wrelik/auth/next',
  '@wrelik/config/server',
  '@wrelik/analytics/server',
  '@wrelik/storage/server',
  '@wrelik/errors/server',
];

/**
 * Vendor SDKs that should only be imported through @wrelik/* packages
 */
const vendorSdkRestrictions = [
  {
    name: '@clerk/nextjs',
    message: 'Please use @wrelik/auth instead.',
  },
  {
    name: '@clerk/backend',
    message: 'Please use @wrelik/auth/server instead.',
  },
  {
    name: '@prisma/client',
    message: 'Please use @wrelik/db instead.',
  },
  {
    name: 'resend',
    message: 'Please use @wrelik/email instead.',
  },
  {
    name: 'posthog-node',
    message: 'Please use @wrelik/analytics/server instead.',
  },
  {
    name: 'posthog-js',
    message: 'Please use @wrelik/analytics/client instead.',
  },
  {
    name: 'inngest',
    message: 'Please use @wrelik/jobs instead.',
  },
  {
    name: '@sentry/node',
    message: 'Please use @wrelik/errors/server instead.',
  },
  {
    name: '@sentry/browser',
    message: 'Please use @wrelik/errors/client instead.',
  },
  {
    name: '@sentry/react-native',
    message: 'Please use @wrelik/errors/react-native instead.',
  },
];

/**
 * Node.js built-in modules that should never be in client bundles
 */
const nodeOnlyModules = [
  'fs',
  'net',
  'tls',
  'child_process',
  'crypto',
  'path',
  'os',
  'stream',
  'http',
  'https',
  'zlib',
  'cluster',
  'dgram',
  'dns',
  'readline',
  'repl',
  'vm',
  'worker_threads',
];

module.exports = {
  extends: ['next', 'turbo', 'prettier', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'only-warn'],
  ignorePatterns: ['dist', '**/*.css', 'node_modules'],
  rules: {
    // TypeScript rules
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    
    // Next.js rules
    '@next/next/no-html-link-for-pages': 'off',
    'react/jsx-key': 'off',

    // Vendor SDK restrictions
    'no-restricted-imports': [
      'error',
      {
        paths: vendorSdkRestrictions,
        patterns: [
          {
            group: ['@aws-sdk/*'],
            message: 'Please use @wrelik/storage instead.',
          },
        ],
      },
    ],
  },
  overrides: [
    // Client-side files (React components with 'use client')
    {
      files: ['**/*.tsx', '**/*.ts'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: [
              ...vendorSdkRestrictions,
              ...serverOnlyPackages.map((pkg) => ({
                name: pkg,
                message: `${pkg} is server-only and cannot be used in client code.`,
              })),
              ...serverOnlySubpaths.map((subpath) => ({
                name: subpath,
                message: `${subpath} is server-only and cannot be used in client code.`,
              })),
              ...nodeOnlyModules.map((mod) => ({
                name: mod,
                message: `'${mod}' is a Node.js built-in and cannot be used in client code.`,
              })),
            ],
            patterns: [
              {
                group: ['@aws-sdk/*'],
                message: 'Please use @wrelik/storage instead.',
              },
              {
                group: ['@wrelik/*/server'],
                message: 'Server-only subpaths cannot be imported in client code.',
              },
            ],
          },
        ],
      },
    },
  ],
  settings: {
    next: {
      rootDir: ['packages/*/'],
    },
  },
};

// Export constants for programmatic use
module.exports.serverOnlyPackages = serverOnlyPackages;
module.exports.serverOnlySubpaths = serverOnlySubpaths;
module.exports.vendorSdkRestrictions = vendorSdkRestrictions;
module.exports.nodeOnlyModules = nodeOnlyModules;
