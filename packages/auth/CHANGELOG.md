# @wrelik/auth

## 2.0.0

### Major Changes

- 818ed58: Refactor runtime packages to strict subpath exports (`/server`, `/client`, `/shared`) with side-effect free entrypoints and hard CI/runtime boundary enforcement.

### Patch Changes

- Updated dependencies [818ed58]
  - @wrelik/errors@2.0.0

## 0.2.2

### Patch Changes

- 2b9cbf7: Fix auth role checks to reject malformed runtime role payloads and remove a duplicate TypeScript compiler option in errors to eliminate build warnings.
- Updated dependencies [2b9cbf7]
  - @wrelik/errors@0.2.1

## Unreleased

### Patch Changes

- Fix role authorization checks to deny malformed runtime `roles` payloads.
- Add regression coverage to ensure malformed `roles` values cannot grant access.

## 0.2.1

### Patch Changes

- adb2048: chore: test release flow with real patch version bump

## 0.2.0

### Minor Changes

- a38ebcb: Add React Native / Expo support and enforce server-only boundaries.

### Patch Changes

- Updated dependencies [a38ebcb]
  - @wrelik/errors@0.2.0

## 0.1.1

### Patch Changes

- Update publishConfig to access:public for all packages.
- Updated dependencies
  - @wrelik/errors@0.1.1

## 0.1.0

### Minor Changes

- ad849e3: Initial release of all wrelik-kit packages.

### Patch Changes

- Updated dependencies [ad849e3]
  - @wrelik/errors@0.1.0
