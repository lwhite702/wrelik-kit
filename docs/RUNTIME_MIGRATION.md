# Runtime Migration Guide

This repository now enforces strict runtime subpath imports.

## Required import changes

Replace root package imports with runtime-specific subpaths:

- `@wrelik/auth` -> `@wrelik/auth/server|client|shared`
- `@wrelik/db` -> `@wrelik/db/server|shared`
- `@wrelik/config` -> `@wrelik/config/server|client|shared`
- `@wrelik/errors` -> `@wrelik/errors/server|client|shared`
- `@wrelik/storage` -> `@wrelik/storage/server|client|shared`
- `@wrelik/analytics` -> `@wrelik/analytics/server|client|shared`
- `@wrelik/email` -> `@wrelik/email/server|shared`
- `@wrelik/jobs` -> `@wrelik/jobs/server|shared`

## Auth migration

1. Move all permission enforcement to server runtime callsites using `@wrelik/auth/server`.
2. Use `@wrelik/auth/client` only for client-side auth payload mapping.
3. Use `@wrelik/auth/shared` for shared types.

## DB migration

1. Consume only `@wrelik/db/server` and `@wrelik/db/shared`.
2. Migrate legacy global checker patterns to explicit injected services.
3. Route data writes through `withTransaction` wrappers.

## Config migration

1. Validate server env explicitly with `@wrelik/config/server` at startup/build.
2. Load client config only from public keys with `@wrelik/config/client`.
3. Remove any fallback secret defaults.

## CI and validation checklist

1. `pnpm install --frozen-lockfile`
2. `pnpm check:workspace-integrity`
3. `pnpm check:runtime-contracts`
4. `pnpm lint`
5. `pnpm typecheck`
6. `pnpm test`
7. `pnpm build`
8. `pnpm check:bundles`
9. `pnpm check:cycles`
