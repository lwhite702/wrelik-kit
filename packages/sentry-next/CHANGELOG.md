# @wrelik/sentry-next

## 1.1.1

### Patch Changes

- 3262454: Upgrade runtime SDK and workspace tooling dependencies to latest compatible versions, including Clerk, Sentry, AWS SDK, Inngest, Resend, Upstash, Zod, TypeScript, Turbo, Vitest, TSUP, and ESLint.

  Adopt root ESLint flat config and align wrapper peer ranges for updated SDK majors while preserving package export paths. Also apply a patched transitive Next.js resolution to close audit findings and keep production audit clean.

  Note: Vite is pinned to the latest 7.x line for runtime compatibility in this environment; this avoids current rolldown native-binding failures seen with Vite 8 under Node 20.18.0.

  Breaking change: `@wrelik/auth` and `@wrelik/clerk-next` now require `@clerk/nextjs@7.x` via updated peer ranges (`>=7 <8`). Consumers on Clerk v4-v6 must upgrade to Clerk v7 before adopting these versions.

## 1.1.0

### Minor Changes

- Add platform wrapper packages for Clerk (Next/Expo), Next Sentry client instrumentation, and Upstash server SDK access so apps can avoid direct vendor imports while staying inside the `@wrelik/*` boundary.

  Add temporary deprecated server-side compatibility singleton exports to analytics, email, jobs, and storage to support DRX migration from root-import convenience APIs to runtime subpaths in one cutover.
