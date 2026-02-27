# Release Checklist (Changesets -> npm)

This is the canonical release process for publishing `@wrelik/*` packages.

## Preflight

- Work from `main`
- Ensure npm publish credentials/secrets are configured for GitHub Actions
- Confirm no local-only dependency specifiers (`file:`, `link:`, tarballs)

## SemVer Expectations

Use Changesets and classify impact per package:

- `MAJOR`: breaking API/runtime behavior/export changes
- `MINOR`: backward-compatible feature additions
- `PATCH`: backward-compatible fixes/internal changes

## PR Requirements (Before Merge)

Run locally:

```bash
pnpm install --frozen-lockfile
pnpm check:workspace-integrity
pnpm check:runtime-contracts
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm check:bundles
pnpm check:cycles
pnpm changeset status
```

Expectations:

- CI is green on the PR
- Every publishable package change has a Changeset
- Runtime adapter packages expose only `/server`, `/client`, `/shared` (+ `package.json`)
- No direct vendor SDK imports appear in app-facing examples/docs

## Release PR (Changesets)

The canonical workflow is `.github/workflows/release.yml`.

Behavior on `main`:

1. CI checks run.
2. `changesets/action` opens or updates a release PR when unreleased Changesets exist.
3. Release PR contains version bumps/changelog updates.

Expectations for the release PR:

- Version bumps match intended SemVer impact
- Changelog text is factual and package-specific
- No unrelated code changes are included

## Publish to npm

When the Changesets release PR is merged:

- The release workflow publishes using `pnpm run publish` (`changeset publish`)
- npm provenance remains enabled (`NPM_CONFIG_PROVENANCE=true`)
- Published versions should match the merged release PR

## Post-Publish Verification

Check npm for each released package/version and verify installability:

```bash
pnpm view @wrelik/auth version
pnpm view @wrelik/db version
```

Optional smoke install in a clean temp repo:

```bash
pnpm add @wrelik/auth@<version> @wrelik/db@<version>
```

## Rollback / Fix-Forward

Preferred approach: fix-forward.

- Publish a patch release if the issue is backward-compatible
- Publish a major/minor if contract changes are required
- Document the incident in the next release PR notes

If an unpublish is unavoidable, follow npm policy and immediately publish a corrected version with a clear changelog entry.
