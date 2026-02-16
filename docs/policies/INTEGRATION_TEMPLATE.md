# Integration template

Status: Draft  
Owner: <TEAM_NAME>  
Last Updated: 2026-02-16  
Applies To: App onboarding and adapter migrations

## Purpose
Template for documenting how `<APP_NAME>` integrates `@wrelik/*` packages, including initialization, usage boundaries, and validation gates.

## Scope
Use this document during:
- New app setup.
- Migration from direct vendor SDK usage to `@wrelik/*` adapters.
- Integration audits.

## Requirements
- The integration record MUST be app-specific and complete before production launch.
- Adapter initialization MUST be centralized.
- Direct vendor imports SHOULD be removed from application-layer code when adapter coverage exists.

## Procedure
1. Fill metadata:
- App name: `<APP_NAME>`
- Repository: `<REPO_URL>`
- Owner team: `<TEAM_NAME>`
- Environment matrix: `<ENV_MATRIX_PATH>`
2. List required packages and pinned versions.
3. Describe bootstrap/initialization order.
4. Document legacy-to-adapter import replacements.
5. Run and record integration validation checks.

## Template fields

### App metadata
- App: `<APP_NAME>`
- Repo: `<REPO_URL>`
- Owner: `<TEAM_NAME>`
- Environment matrix: `<ENV_MATRIX_PATH>`

### Dependency method
- Package manager: `pnpm`
- Source: npm registry or internal registry mirror

### Integrated packages
- `@wrelik/auth@<VERSION>`
- `@wrelik/db@<VERSION>`
- `@wrelik/storage@<VERSION>`
- `@wrelik/analytics@<VERSION>`
- `@wrelik/errors@<VERSION>`
- `@wrelik/email@<VERSION>`
- `@wrelik/jobs@<VERSION>`
- `@wrelik/config@<VERSION>`

### Initialization order
1. Database
2. Auth
3. Storage
4. Analytics
5. Errors
6. Jobs
7. Email
8. Config

### Validation checks

```bash
pnpm install
pnpm lint
pnpm test
pnpm build
```

### Migration checklist
- [ ] Direct vendor imports replaced where adapter exists.
- [ ] Central adapter initialization implemented.
- [ ] Tenant isolation checks added for data boundaries.
- [ ] Error and analytics capture wired through shared adapters.
- [ ] Documentation and runbooks updated.

## Exceptions
If a direct vendor import is temporarily required, record:
- Reason.
- Expected removal date.
- Owner.

## References
- `./STACK_POLICY.md`
- `./AGENTS_POLICY.md`
- `./CHECKLIST_PRERELEASE.md`
