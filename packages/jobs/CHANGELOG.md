# @wrelik/jobs

## 2.0.0

### Major Changes

- 818ed58: Refactor runtime packages to strict subpath exports (`/server`, `/client`, `/shared`) with side-effect free entrypoints and hard CI/runtime boundary enforcement.

### Minor Changes

- Add platform wrapper packages for Clerk (Next/Expo), Next Sentry client instrumentation, and Upstash server SDK access so apps can avoid direct vendor imports while staying inside the `@wrelik/*` boundary.

  Add temporary deprecated server-side compatibility singleton exports to analytics, email, jobs, and storage to support DRX migration from root-import convenience APIs to runtime subpaths in one cutover.

## 0.1.2

### Patch Changes

- a38ebcb: Add React Native / Expo support and enforce server-only boundaries.

## 0.1.1

### Patch Changes

- Update publishConfig to access:public for all packages.

## 0.1.0

### Minor Changes

- ad849e3: Initial release of all wrelik-kit packages.
