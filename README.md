# wrelik-kit

Shared packages repository for all Wrelik applications.

This monorepo contains **vendor-agnostic adapters, shared utilities, and configuration packages** used across the Wrelik ecosystem. It defines the integration boundary between application code and third-party services.

This repository is long-lived, intentionally boring, and treated as infrastructure.

---

## Core Principles

- Adapter-first architecture
- No direct vendor SDK usage in app repos
- Postgres-first, provider-second
- Explicit boundaries and minimal surface area
- No placeholders, no stubs, no mock logic
- Easy to replace vendors without rewriting apps

If a package does not reduce duplication or enforce a standard, it does not belong here.

---

## Packages

### Core

- **@wrelik/auth**  
  Clerk adapter for authentication, session handling, and RBAC.  
  Apps must not import Clerk SDKs directly.

- **@wrelik/db**  
  Prisma client singleton and tenant-context helpers.  
  Enforces safe multi-tenant access patterns.

- **@wrelik/storage**  
  S3-compatible adapter (Cloudflare R2).  
  Handles signed URLs, uploads, downloads, and validation.

- **@wrelik/errors**  
  Typed application errors and centralized Sentry integration.

- **@wrelik/config**  
  Typed environment variable loading using Zod.  
  Provides shared vendor schemas and extension hooks.

### Services

- **@wrelik/analytics**  
  PostHog adapter for server-side analytics.  
  Enforces event naming conventions.

- **@wrelik/email**  
  Resend adapter for transactional email and template registry.

- **@wrelik/jobs**  
  Inngest wrapper for background jobs and event-driven workflows.

### Tooling

- **@wrelik/tsconfig**  
  Shared TypeScript base configurations.

- **@wrelik/eslint-config**  
  Shared ESLint configuration for Node and Next.js projects.

---

## Mobile (Expo) Support

wrelik-kit provides first-class support for Expo (React Native) apps.

### Supported Packages

Import these using explicit runtime subpaths:

- **@wrelik/auth/client**
- **@wrelik/config/client**
- **@wrelik/errors/client**
- **@wrelik/analytics/client**
- **@wrelik/storage/client**

### Server-Only Packages

These packages **cannot** be used directly in mobile apps. Importing them will throw a runtime error.

- **@wrelik/db/server**
- **@wrelik/email/server**
- **@wrelik/jobs/server**

Mobile apps should interact with these services via your backend API.

### Setup

Ensure your mobile app installs client-side dependencies required by the selected runtime adapters (for example `posthog-react-native`).

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

## Installation (Apps)

Each app consumes packages from this repo as dependencies.

Example:

```bash
pnpm add @wrelik/auth @wrelik/db @wrelik/storage
```

Apps must use explicit runtime imports:

- `@wrelik/*/server`
- `@wrelik/*/client`
- `@wrelik/*/shared`

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
