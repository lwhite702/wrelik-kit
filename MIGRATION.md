# Migration Guide

## How to remove vendored wrelik packages from an app repo and consume wrelik-kit properly

This guide is for app repos (including DRX) that currently vendor/copy Wrelik integration code.

## Goal

Replace vendored integration packages and direct vendor SDK imports with versioned `@wrelik/*` dependencies from npm, using explicit runtime subpaths.

## 1. Inventory current usage

Identify:

- Vendored Wrelik package directories/files in the app repo
- Direct vendor SDK imports (`@clerk/*`, `@sentry/*`, `posthog-*`, `resend`, `inngest`, `@aws-sdk/*`, `@upstash/*`)
- Runtime usage locations (server, browser, mobile/shared)

## 2. Install `@wrelik/*` packages from npm

Example:

```bash
pnpm add @wrelik/auth @wrelik/config @wrelik/errors @wrelik/storage
pnpm add @wrelik/db @wrelik/email @wrelik/jobs @wrelik/analytics
```

Pin exact versions during migration if multiple apps are moving together:

```bash
pnpm add @wrelik/auth@<version> @wrelik/db@<version>
```

## 3. Replace imports with runtime subpaths

Use only:

- `@wrelik/*/server`
- `@wrelik/*/client`
- `@wrelik/*/shared`

Examples:

```ts
// Server
import { getSession } from '@wrelik/auth/server';
import { captureError } from '@wrelik/errors/server';

// Client / Expo
import { mapClerkToSession } from '@wrelik/auth/client';
import { normalizeError } from '@wrelik/errors/client';

// Shared
import type { WorkflowSession } from '@wrelik/auth/shared';
```

Notes:

- `@wrelik/db/client`, `@wrelik/email/client`, and `@wrelik/jobs/client` are fail-fast stubs by design. Call backend APIs instead.
- Do not import runtime adapter roots (`@wrelik/auth`, `@wrelik/db`, etc.).

## 4. Remove vendored code paths

- Delete vendored Wrelik package copies
- Remove app-local wrappers that duplicate `@wrelik/*` functionality unless they contain app-specific business logic
- Remove direct vendor SDK dependencies that are no longer used

## 5. Add/enable banned-import guardrails

- Add ESLint `no-restricted-imports` rules (see [`docs/BANNED_IMPORTS.md`](./docs/BANNED_IMPORTS.md))
- Block direct vendor imports in app code

## 6. Validate the app repo

Run the app repo validation suite (adapt to your stack):

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Also verify:

- No direct vendor SDK imports remain in app source
- Client/mobile bundles do not include server-only packages or secrets
- Auth/session, tenant scoping, storage uploads, and error handling still work end-to-end

## Temporary fallback (only if registry install is blocked)

Registry publish is the preferred path. If npm installation is temporarily unavailable:

- Pin the last known-good published `@wrelik/*` versions, or
- Use a documented short-lived git dependency pin by commit/tag in the app repo with a follow-up task to return to npm packages

Do not re-vendor packages as a long-term workflow.
