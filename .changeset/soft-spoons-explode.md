---
'@wrelik/analytics': patch
'@wrelik/auth': patch
'@wrelik/clerk-expo': patch
'@wrelik/clerk-next': patch
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
