---
'@wrelik/analytics': patch
'@wrelik/auth': major
'@wrelik/clerk-expo': patch
'@wrelik/clerk-next': major
'@wrelik/config': patch
'@wrelik/db': patch
'@wrelik/email': patch
'@wrelik/errors': patch
'@wrelik/eslint-config': patch
'@wrelik/jobs': patch
'@wrelik/sentry-next': patch
'@wrelik/storage': patch
'@wrelik/tsconfig': patch
'@wrelik/upstash': patch
---

Upgrade runtime SDK and workspace tooling dependencies to latest compatible versions, including Clerk, Sentry, AWS SDK, Inngest, Resend, Upstash, Zod, TypeScript, Turbo, Vitest, TSUP, and ESLint.

Adopt root ESLint flat config and align wrapper peer ranges for updated SDK majors while preserving package export paths. Also apply a patched transitive Next.js resolution to close audit findings and keep production audit clean.

Note: Vite is pinned to the latest 7.x line for runtime compatibility in this environment; this avoids current rolldown native-binding failures seen with Vite 8 under Node 20.18.0.

Breaking change: `@wrelik/auth` and `@wrelik/clerk-next` now require `@clerk/nextjs@7.x` via updated peer ranges (`>=7 <8`). Consumers on Clerk v4-v6 must upgrade to Clerk v7 before adopting these versions.
