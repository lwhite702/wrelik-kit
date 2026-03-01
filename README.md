# wrelik-kit

Shared packages repository for all Wrelik applications.

This monorepo is the enforceable integration boundary between Wrelik apps and third-party vendors. App repos (including DRX) should import `@wrelik/*` packages only and avoid direct vendor SDK imports.

## Core Principles

- Adapter-first architecture
- No direct vendor SDK usage in app repos
- Explicit runtime boundaries: `server`, `client`, `shared`
- Expo-safe client entrypoints
- Minimal, testable adapter contracts
- Changesets-driven releases

## Runtime Import Policy (Canonical)

Apps must import from explicit runtime subpaths only:

- `@wrelik/<pkg>/server`
- `@wrelik/<pkg>/client`
- `@wrelik/<pkg>/shared`

Runtime adapter packages do not expose a root export (`@wrelik/<pkg>`).

### Server-only adapters with client stubs

All runtime adapters expose `/client`, including server-centric adapters. For `@wrelik/db/client`, `@wrelik/email/client`, and `@wrelik/jobs/client`, the client entrypoint is a fail-fast stub that throws immediately with a clear message telling apps to call backend APIs.

## Packages

### Runtime Adapters

- `@wrelik/auth` (Clerk adapter)
- `@wrelik/db` (tenant-safe DB helpers)
- `@wrelik/storage` (R2/S3-compatible storage)
- `@wrelik/errors` (typed error shapes + server Sentry capture)
- `@wrelik/config` (typed env/config loading)
- `@wrelik/analytics` (PostHog adapter)
- `@wrelik/email` (Resend adapter)
- `@wrelik/jobs` (Inngest wrapper)

### Tooling

- `@wrelik/tsconfig`
- `@wrelik/eslint-config`

## DRX Consumption

### Next (DRX Web)

Use runtime subpaths by execution context:

- Server routes/actions/middleware: `@wrelik/*/server`
- React client components / browser code: `@wrelik/*/client`
- Shared types/utilities: `@wrelik/*/shared`

See [DRX Next Consumption](./docs/DRX_NEXT_CONSUMPTION.md).

### Expo (DRX Mobile)

Expo apps should use `@wrelik/*/client` and `@wrelik/*/shared` only. Server-centric adapters intentionally fail fast in `/client` so secrets and server SDKs cannot leak into the mobile app.

See [Mobile Support (Expo)](./docs/MOBILE_SUPPORT.md).

## Banned Imports (App Repos)

App repos must not directly import vendor SDKs such as:

- `@clerk/*`
- `@sentry/*`
- `posthog-node`
- `resend`
- `inngest`
- `@aws-sdk/*`
- `@upstash/*`

Use `@wrelik/*` adapters instead. See [Banned Imports](./docs/BANNED_IMPORTS.md).

## Install and Pin (npm)

See [Mobile Support Docs](./docs/MOBILE_SUPPORT.md) for deeper integration details.

---

## What This Repo Is Not

- Not a UI component library
- Not app-specific business logic
- Not a feature playground
- Not a place to “just put helpers”

Application code lives in app repos.  
This repo exists to **standardize integrations and enforce discipline**.

---

## App Bootstrap

For starting a new repository that follows Wrelik standards, see the [App Bootstrap Guide](./docs/APP_BOOTSTRAP_GUIDE.md).

For adopting policies in an existing repository, see the [Policy Import Guide](./docs/POLICY_IMPORT_GUIDE.md).

> [!TIP]
> Use the `/onboard-agentic-repo` workflow to quickly initialize policies and agent guidelines in any repository.

---

## Installation (Apps)

Each app consumes packages from this repo as dependencies.

Example:

```bash
pnpm add @wrelik/auth @wrelik/db @wrelik/errors @wrelik/storage
pnpm add @wrelik/analytics @wrelik/email @wrelik/jobs @wrelik/config
```

Pin exact versions when coordinating cross-app rollouts:

```bash
pnpm add @wrelik/auth@1.0.0 @wrelik/db@1.0.0
```

## Development

```bash
pnpm install
pnpm check:workspace-integrity
pnpm check:runtime-contracts
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm check:bundles
pnpm check:cycles
```

## Releases

- Changesets is the source of truth for package version bumps.
- The canonical publish path is the Changesets release workflow (`.github/workflows/release.yml`) to npm.
- Use the release checklist in [`docs/RELEASE_CHECKLIST.md`](./docs/RELEASE_CHECKLIST.md).

## Additional Docs

- [Migration Guide](./MIGRATION.md)
- [Runtime Migration Notes](./docs/RUNTIME_MIGRATION.md)
- [Add a New Adapter Package](./docs/ADDING_ADAPTER_PACKAGE.md)
