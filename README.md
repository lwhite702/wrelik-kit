# wrelik-kit

Shared packages repository for all Wrelik apps. This monorepo hosts vendor-agnostic adapters and utilities for the Wrelik ecosystem.

## Packages

### Core

- **[@wrelik/auth](./packages/auth)**: Clerk adapter for authentication and RBAC.
- **[@wrelik/db](./packages/db)**: Prisma client singleton and tenant contextualization.
- **[@wrelik/storage](./packages/storage)**: S3-compatible adapter (Cloudflare R2) for file operations.
- **[@wrelik/errors](./packages/errors)**: Standardized application errors and Sentry integration.
- **[@wrelik/config](./packages/config)**: Typed environment variable loading with Zod.

### Services

- **[@wrelik/analytics](./packages/analytics)**: PostHog adapter for server-side analytics.
- **[@wrelik/email](./packages/email)**: Resend adapter for transactional emails.
- **[@wrelik/jobs](./packages/jobs)**: Inngest wrapper for background jobs.

### Tooling

- **[@wrelik/tsconfig](./packages/tsconfig)**: Shared TypeScript configurations.
- **[@wrelik/eslint-config](./packages/eslint-config)**: Shared ESLint configuration.

## Getting Started

### Installation

```bash
pnpm install
```

### Building

```bash
pnpm build
```

### Testing

```bash
pnpm test
```

## Architecture

This repository follows a strict "Adapter Pattern" approach.

- **No direct vendor SDK usage**: Apps should import from `@wrelik/*` packages, not use `clerk`, `resend`, `posthog` directly.
- **No placeholders**: All functions are implemented and type-safe.
- **Strict Boundaries**: Packages do not contain app-specific business logic.
