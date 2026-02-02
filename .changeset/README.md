# Changesets

This repository uses [Changesets](https://github.com/changesets/changesets) to manage versioning and publishing.

## Workflow

1.  **Make Changes**: Modify the codebase.
2.  **Add Changeset**: Run `pnpm changeset` to generate a changelog entry.
    - Select the packages you modified.
    - Choose the semantic version bump (patch, minor, major).
    - Write a summary of the change.
3.  **Commit**: Commit the `.changeset/*.md` file with your code.
4.  **Push & PR**: Open a Pull Request.
5.  **Release**:
    - When the PR is merged to `main`, the "Release" Action will create a "Version Packages" PR.
    - Merging the "Version Packages" PR publishes the new versions to NPM.

## Principles

- **Explicit Versioning**: All changes that affect the published package must have a changeset.
- **Semver**: Follow strict semantic versioning.
  - `patch`: Bug fixes, no API changes.
  - `minor`: New features, backwards compatible.
  - `major`: Breaking changes.
