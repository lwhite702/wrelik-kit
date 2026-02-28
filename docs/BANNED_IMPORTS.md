# Banned Imports in App Repos

App repos (including DRX) must not import vendor SDKs directly. All integrations must come through `@wrelik/*` packages.

## Banned -> Allowed Examples

- `@clerk/*` -> `@wrelik/auth/*`
- `@sentry/node`, `@sentry/browser` -> `@wrelik/errors/server` or `@wrelik/errors/client`
- `posthog-node`, `posthog-js`, `posthog-react-native` -> `@wrelik/analytics/*`
- `resend` -> `@wrelik/email/server`
- `inngest` -> `@wrelik/jobs/server`
- `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner` -> `@wrelik/storage/server`
- `@upstash/*` -> a dedicated `@wrelik/*` adapter (do not import directly in app code)

## Examples

```ts
// Banned
import { Resend } from 'resend';
import { Inngest } from 'inngest';
import * as Sentry from '@sentry/node';

// Allowed
import { createEmailServer } from '@wrelik/email/server';
import { createJobsServer } from '@wrelik/jobs/server';
import { captureError } from '@wrelik/errors/server';
```

## Suggested ESLint Guardrail (App Repos)

```js
// .eslintrc.cjs
module.exports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          { name: '@clerk/backend', message: 'Use @wrelik/auth/server' },
          { name: '@clerk/nextjs', message: 'Use @wrelik/auth/server' },
          { name: '@sentry/node', message: 'Use @wrelik/errors/server' },
          { name: '@sentry/browser', message: 'Use @wrelik/errors/client' },
          { name: 'posthog-node', message: 'Use @wrelik/analytics/server' },
          { name: 'resend', message: 'Use @wrelik/email/server' },
          { name: 'inngest', message: 'Use @wrelik/jobs/server' },
          { name: '@aws-sdk/client-s3', message: 'Use @wrelik/storage/server' },
          { name: '@aws-sdk/s3-request-presigner', message: 'Use @wrelik/storage/server' },
        ],
        patterns: ['@upstash/*'],
      },
    ],
  },
};
```
