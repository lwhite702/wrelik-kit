# Contributing

## Adding a New Package

1. Create a folder in `packages/`.
2. Initialize `package.json` with `@wrelik/` scope.
3. Add `@wrelik/tsconfig` and `@wrelik/eslint-config` as dev dependencies.
4. Implement source in `src/index.ts`.
5. Add minimal tests.

## Versioning & Publishing

We use [Changesets](https://github.com/changesets/changesets) for versioning.

### Creating a Changeset

When you make changes to a package, run:

```bash
pnpm changeset
```

Follow the prompts to select the packages changed and the semver bump type (patch, minor, major).
Commit the generated `.changeset/*.md` file.

### Publishing

The CI pipeline automatically handles publishing when changesets are merged to main.
To publish manually (requires auth):

```bash
pnpm publish
```
