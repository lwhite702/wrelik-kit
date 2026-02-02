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

### Release Lifecycle

1. **Development**: Create feature branches.
2. **Versioning**: Run `pnpm changeset` to generate a version bump file.
3. **Pull Request**: Open a PR with your code + changeset file.
4. **Merge**: Once passed CI, merge to `main`.
5. **Version PR**: The "Release" GitHub Action will detect the changeset and open a _Version Packages_ PR.
6. **Publish**: Merging the _Version Packages_ PR will trigger the release to NPM.
