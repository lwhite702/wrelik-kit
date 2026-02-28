# Runtime Migration Guide

This repository enforces strict runtime subpath imports for adapter packages.

## Required imports (all runtime adapters)

Use explicit subpaths only:

- `@wrelik/<pkg>/server`
- `@wrelik/<pkg>/client`
- `@wrelik/<pkg>/shared`

Runtime adapter root imports (for example `@wrelik/auth`) are forbidden.

## Package notes

- `@wrelik/db/client`, `@wrelik/email/client`, `@wrelik/jobs/client` are fail-fast stubs for surface consistency. Call backend APIs instead.
- `@wrelik/errors/client` is client-safe and exposes normalization helpers; server Sentry capture remains on `@wrelik/errors/server`.
- Expo apps should use only `/client` and `/shared` entrypoints.

## Migration checklist

1. Replace root imports with runtime subpaths.
2. Remove direct vendor SDK imports from app repos.
3. Move server-only integrations to backend codepaths.
4. Run app lint/typecheck/tests/build.
5. Add banned-import lint rules to prevent regressions.
