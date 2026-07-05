---
'@wrelik/analytics': patch
'@wrelik/auth': patch
'@wrelik/email': patch
'@wrelik/errors': patch
'@wrelik/jobs': patch
'@wrelik/storage': patch
---

chore(deps): bump runtime dependencies to latest compatible versions

- `posthog-node` 5.28.11 → 5.39.4 (@wrelik/analytics)
- `@clerk/backend` 3.2.4 → 3.10.0 (@wrelik/auth)
- `resend` 6.10.0 → 6.17.1 (@wrelik/email)
- `@sentry/browser` + `@sentry/node` 10.47.0 → 10.63.0 (@wrelik/errors)
- `inngest` 4.1.2 → 4.11.0 (@wrelik/jobs)
- `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner` 3.1023.0 → 3.1079.0 (@wrelik/storage)

No breaking changes. Workspace tooling also updated: turbo 2.10.3, typescript 6.0.3,
eslint 10.6.0, prettier 3.9.4, @changesets/cli 2.31.0, dependency-cruiser 18.0.0,
vitest 4.1.9, @types/node 26.x (all devDependencies, no changeset required).
