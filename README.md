# wrelik-kit

Shared packages repository for all Wrelik applications.

This monorepo contains **vendor-agnostic adapters, shared utilities, and configuration packages** used across the Wrelik ecosystem. It defines the integration boundary between application code and third-party services.

This repository is long-lived, intentionally boring, and treated as infrastructure.

---

## Core Principles

- **Adapter-first architecture**
- **No direct vendor SDK usage in app repos**
- **Postgres-first, provider-second**
- **Explicit server/client/shared boundaries**
- **No placeholders, no stubs, no mock logic**
- **No import-time side effects**
- **Easy to replace vendors without rewriting apps**

If a package does not reduce duplication or enforce a standard, it does not belong here.

---

## Runtime Boundary Model

Every package in wrelik-kit follows a strict server/client/shared boundary:

```
@wrelik/<package>/server   → Server-only code (Node.js)
@wrelik/<package>/client   → Client-safe code (Browser)
@wrelik/<package>/shared   → Types and pure utilities (both)
@wrelik/<package>/react-native → React Native specific code
```

### Why This Matters

1. **No import-time side effects**: Nothing runs automatically when you import a package
2. **Clear boundaries**: Server-only code can never accidentally end up in client bundles
3. **Tree-shaking friendly**: Smaller bundles by only importing what you need
4. **Type safety**: TypeScript properly resolves types for each environment

### Example

```ts
// ❌ Wrong - imports everything including server code
import { initAnalytics } from '@wrelik/analytics';

// ✅ Correct - explicit server import
import { initAnalytics } from '@wrelik/analytics/server';

// ✅ Correct - client-safe import
import { capture } from '@wrelik/analytics/client';
```

See [MIGRATION.md](./MIGRATION.md) for detailed migration guide.

---

## Packages

### Core

- **@wrelik/auth**  
  Clerk adapter for authentication, session handling, and RBAC.  
  - `/server` - Server-side auth with @clerk/backend
  - `/next` - Next.js server component helpers
  - `/client` - Client-safe session mapping
  - `/react-native` - React Native session helpers

- **@wrelik/db** *(server-only)*  
  Prisma client singleton and tenant-context helpers.  
  - `/server` - Database operations
  - `/shared` - Tenant context types
  - Enforces safe multi-tenant access patterns.

- **@wrelik/storage**  
  S3-compatible adapter (Cloudflare R2).  
  - `/server` - S3 client operations, signed URL generation
  - `/client` - Upload/download using signed URLs

- **@wrelik/errors**  
  Typed application errors and centralized Sentry integration.  
  - `/server` - Sentry Node SDK integration
  - `/client` - Sentry Browser SDK integration
  - `/react-native` - Sentry React Native SDK integration
  - `/shared` - Error classes (safe everywhere)

- **@wrelik/config**  
  Typed environment variable loading using Zod.  
  - `/server` - Server-side config with optional dotenv loading
  - `/client` - Client-safe config loading
  - `/react-native` - React Native config loading
  - No automatic dotenv loading (must call explicitly)

### Services

- **@wrelik/analytics**  
  PostHog adapter for analytics.  
  - `/server` - Server-side PostHog (Node SDK)
  - `/client` - Browser PostHog (JS SDK)
  - `/react-native` - React Native PostHog
  - Enforces event naming conventions.

- **@wrelik/email** *(server-only)*  
  Resend adapter for transactional email and template registry.
  - `/server` - Email operations
  - `/shared` - Types and options

- **@wrelik/jobs** *(server-only)*  
  Inngest wrapper for background jobs and event-driven workflows.
  - `/server` - Job operations
  - `/shared` - Types and options

### Tooling

- **@wrelik/tsconfig**  
  Shared TypeScript base configurations.

- **@wrelik/eslint-config**  
  Shared ESLint configuration with enforcement rules:
  - Bans vendor SDK imports (enforce using @wrelik/* packages)
  - Bans server imports in client components
  - Bans Node.js built-ins in client code

---

## Mobile (Expo) Support

wrelik-kit provides first-class support for Expo (React Native) apps.

### Client-Safe Packages

These packages have `/client` or `/react-native` entrypoints:

- **@wrelik/auth/react-native**: Session helpers and types
- **@wrelik/config/react-native**: Client-side configuration loading
- **@wrelik/errors/react-native**: Error handling with Sentry
- **@wrelik/analytics/react-native**: PostHog analytics
- **@wrelik/storage/react-native**: Upload/download using signed URLs

### Server-Only Packages

These packages **cannot** be used directly in mobile apps:

- **@wrelik/db** (use `/shared` for types only)
- **@wrelik/email** (use `/shared` for types only)
- **@wrelik/jobs** (use `/shared` for types only)

Mobile apps should interact with these services via your backend API.

---

## Enforcement

wrelik-kit enforces boundaries at multiple levels:

### ESLint Rules

The `@wrelik/eslint-config` package includes rules that:

1. **Ban vendor SDK imports**
   ```ts
   // ❌ Error
   import { auth } from '@clerk/nextjs';
   
   // ✅ Correct
   import { getSession } from '@wrelik/auth/next';
   ```

2. **Ban server imports in client code**
   ```ts
   // ❌ Error in 'use client' files
   import { setTenantAccessChecker } from '@wrelik/db';
   ```

3. **Ban Node.js built-ins in client code**
   ```ts
   // ❌ Error in client code
   import fs from 'fs';
   ```

### CI Checks

Every PR runs these checks:

1. **Circular Dependency Detection**: No cross-package cycles
2. **Bundle Scanning**: No forbidden modules in client bundles
3. **Smoke Tests**: All export maps resolve correctly

---

## What This Repo Is Not

- Not a UI component library
- Not app-specific business logic
- Not a feature playground
- Not a place to "just put helpers"

Application code lives in app repos.  
This repo exists to **standardize integrations and enforce discipline**.

---

## Installation (Apps)

Each app consumes packages from this repo as dependencies.

```bash
pnpm add @wrelik/auth @wrelik/db @wrelik/storage
```

Apps must import vendor functionality exclusively through `@wrelik/*` packages.

---

## Development

Install dependencies:

```bash
pnpm install
```

Build all packages:

```bash
pnpm build
```

Run tests:

```bash
pnpm test
```

Run all checks:

```bash
pnpm check:all
```

This runs:
- Circular dependency detection
- Bundle scanning for forbidden modules
- Smoke tests for export resolution

---

## Versioning and Releases

- This repo uses Changesets.
- Any change to a package requires a changeset.
- Breaking changes must be explicit and documented.
- Apps are responsible for testing upgrades before rollout.

---

## Governance

- Vendor decisions are documented in `DECISIONS.md`
- Exceptions to the standard stack require written justification
- Changes that affect app behavior must be reflected in CHANGELOGs downstream

This repo enforces standards.  
Apps conform to it, not the other way around.
