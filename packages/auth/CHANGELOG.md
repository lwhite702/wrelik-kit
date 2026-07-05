# @wrelik/auth

## 3.0.1

### Patch Changes

- 8083eb8: chore(deps): bump runtime dependencies to latest compatible versions

  - `posthog-node` 5.28.11 → 5.39.4 (@wrelik/analytics)
  - `@clerk/backend` 3.2.4 → 3.10.0 (@wrelik/auth)
  - `resend` 6.10.0 → 6.17.1 (@wrelik/email)
  - `@sentry/browser` + `@sentry/node` 10.47.0 → 10.63.0 (@wrelik/errors)
  - `inngest` 4.1.2 → 4.11.0 (@wrelik/jobs)
  - `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner` 3.1023.0 → 3.1079.0 (@wrelik/storage)

  No breaking changes. Workspace tooling also updated: turbo 2.10.3, typescript 6.0.3,
  eslint 10.6.0, prettier 3.9.4, @changesets/cli 2.31.0, dependency-cruiser 18.0.0,
  vitest 4.1.9, @types/node 26.x (all devDependencies, no changeset required).

- Updated dependencies [8083eb8]
  - @wrelik/errors@2.0.2

## 3.0.0

### Major Changes

- 3262454: Upgrade runtime SDK and workspace tooling dependencies to latest compatible versions, including Clerk, Sentry, AWS SDK, Inngest, Resend, Upstash, Zod, TypeScript, Turbo, Vitest, TSUP, and ESLint.

  Adopt root ESLint flat config and align wrapper peer ranges for updated SDK majors while preserving package export paths. Also apply a patched transitive Next.js resolution to close audit findings and keep production audit clean.

  Note: Vite is pinned to the latest 7.x line for runtime compatibility in this environment; this avoids current rolldown native-binding failures seen with Vite 8 under Node 20.18.0.

  Breaking change: `@wrelik/auth` and `@wrelik/clerk-next` now require `@clerk/nextjs@7.x` via updated peer ranges (`>=7 <8`). Consumers on Clerk v4-v6 must upgrade to Clerk v7 before adopting these versions.

### Patch Changes

- Updated dependencies [3262454]
  - @wrelik/errors@2.0.1

## 2.0.0

### Major Changes

- 818ed58: Refactor runtime packages to strict subpath exports (`/server`, `/client`, `/shared`) with side-effect free entrypoints and hard CI/runtime boundary enforcement.

### Patch Changes

- Updated dependencies [818ed58]
  - @wrelik/errors@2.0.0

## 0.2.2

### Patch Changes

- 2b9cbf7: Fix auth role checks to reject malformed runtime role payloads and remove a duplicate TypeScript compiler option in errors to eliminate build warnings.
- Updated dependencies [2b9cbf7]
  - @wrelik/errors@0.2.1

## Unreleased

### Patch Changes

- Fix role authorization checks to deny malformed runtime `roles` payloads.
- Add regression coverage to ensure malformed `roles` values cannot grant access.

## 0.2.1

### Patch Changes

- adb2048: chore: test release flow with real patch version bump

## 0.2.0

### Minor Changes

- a38ebcb: Add React Native / Expo support and enforce server-only boundaries.

### Patch Changes

- Updated dependencies [a38ebcb]
  - @wrelik/errors@0.2.0

## 0.1.1

### Patch Changes

- Update publishConfig to access:public for all packages.
- Updated dependencies
  - @wrelik/errors@0.1.1

## 0.1.0

### Minor Changes

- ad849e3: Initial release of all wrelik-kit packages.

### Patch Changes

- Updated dependencies [ad849e3]
  - @wrelik/errors@0.1.0
