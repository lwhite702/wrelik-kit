const NODE_BUILTINS = [
  'assert',
  'buffer',
  'child_process',
  'crypto',
  'events',
  'fs',
  'http',
  'https',
  'module',
  'net',
  'os',
  'path',
  'stream',
  'tls',
  'url',
  'util',
  'vm',
  'worker_threads',
  'zlib',
];

const SERVER_ONLY_SDKS = [
  '@clerk/backend',
  '@clerk/nextjs',
  'dotenv',
  'inngest',
  'posthog-node',
  'resend',
  '@sentry/node',
  '@aws-sdk/client-s3',
  '@aws-sdk/s3-request-presigner',
];

module.exports = {
  extends: ['next', 'turbo', 'prettier', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'only-warn', 'import'],
  ignorePatterns: ['dist', '**/*.css'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'react/jsx-key': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'import/no-cycle': 'error',
    'import/no-unassigned-import': ['error', { allow: [] }],
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@clerk/nextjs',
            message: 'Use @wrelik/auth/server instead.',
          },
          {
            name: '@prisma/client',
            message: 'Expose domain-level operations from @wrelik/db/server instead.',
          },
          {
            name: 'resend',
            message: 'Use @wrelik/email/server instead.',
          },
          {
            name: 'posthog-node',
            message: 'Use @wrelik/analytics/server instead.',
          },
          {
            name: 'inngest',
            message: 'Use @wrelik/jobs/server instead.',
          },
          {
            name: '@sentry/node',
            message: 'Use @wrelik/errors/server instead.',
          },
        ],
        patterns: [
          {
            group: ['@aws-sdk/*'],
            message: 'Use @wrelik/storage/server instead.',
          },
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['**/src/client/**/*.{ts,tsx,js,jsx}'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: SERVER_ONLY_SDKS.concat(
              NODE_BUILTINS,
              NODE_BUILTINS.map((name) => `node:${name}`),
            ).map((name) => ({
              name,
              message: 'Client runtime modules must remain browser/isomorphic safe.',
            })),
            patterns: [
              {
                group: ['@wrelik/*/server', '**/server', '**/server/*', '../server', '../server/*'],
                message: 'Client runtime modules cannot import server runtime modules.',
              },
            ],
          },
        ],
      },
    },
    {
      files: ['**/src/shared/**/*.{ts,tsx,js,jsx}'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: SERVER_ONLY_SDKS.concat(
              NODE_BUILTINS,
              NODE_BUILTINS.map((name) => `node:${name}`),
            ).map((name) => ({
              name,
              message: 'Shared runtime modules must remain fully isomorphic.',
            })),
            patterns: [
              {
                group: [
                  '@wrelik/*/server',
                  '@wrelik/*/client',
                  '**/server',
                  '**/server/*',
                  '**/client',
                  '**/client/*',
                  '../server',
                  '../server/*',
                  '../client',
                  '../client/*',
                ],
                message: 'Shared runtime modules cannot import server/client runtime modules.',
              },
            ],
          },
        ],
      },
    },
    {
      files: ['**/src/server/**/*.{ts,tsx,js,jsx}'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['@wrelik/*/client', '**/client', '**/client/*', '../client', '../client/*'],
                message: 'Server runtime modules cannot import client runtime modules.',
              },
            ],
          },
        ],
      },
    },
  ],
};
