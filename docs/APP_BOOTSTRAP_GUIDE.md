# App Bootstrap Guide

Status: Active  
Owner: <TEAM_NAME>  
Last Updated: 2026-02-28  
Applies To: All new Wrelik application repositories

## Purpose

This guide provides the standard procedure for and initializing a new Wrelik application repository. Following this process ensures parity with the `wrelik-kit` ecosystem, consistent policy enforcement, and a predictable path to production.

## Prerequisites

- Node.js (Latest LTS)
- `pnpm` (latest)
- Access to the `wrelik-kit` repository

## Phase 1: Repository Initialization

1. **Create the Project Directory**

   ```bash
   mkdir <app-name>
   cd <app-name>
   git init
   ```

2. **Initialize pnpm**

   ```bash
   pnpm init
   ```

3. **Install Core Tooling**
   Initialize your Next.js application (if applicable):

   ```bash
   npx create-next-app@latest . --typescript --eslint --tailwind ...
   ```

## Phase 2: Policy Adoption

1. **Clone/Copy Policies**
   Copy the `docs/policies` directory from `wrelik-kit` into your new repository root.

   ```bash
   cp -r /path/to/wrelik-kit/docs/policies ./docs/
   ```

2. **Customize Policy Metadata**
   Follow the procedure in `docs/policies/README.md` to:
   - Replace placeholders (`<APP_NAME>`, `<REPO_URL>`, `<TEAM_NAME>`, etc.) in all policy files.
   - Update the "Last Updated" and "Owner" fields in each file header.

3. **Commit Policies**
   Ensure the base policies are committed as the first major documentation change.

## Phase 3: Stack Integration

1. **Install @wrelik Adapters**
   Install the standard stack packages:

   ```bash
   pnpm add @wrelik/auth @wrelik/db @wrelik/storage @wrelik/config @wrelik/errors @wrelik/analytics @wrelik/email @wrelik/jobs
   ```

2. **Initialize Adapters**
   Create a centralized initialization layer (usually in `lib/wrelik.ts` or similar) following the pattern in `INTEGRATION_TEMPLATE.md`.

3. **Fill the Integration Template**
   Complete `docs/policies/INTEGRATION_TEMPLATE.md` with:
   - Package versions used.
   - Specific environment variable requirements.
   - Bootstrap order.

## Phase 4: Quality Gate Setup

1. **Configure Linting and Typechecking**
   Adopt `@wrelik/eslint-config` and `@wrelik/tsconfig` to ensure standards are enforced locally.

2. **Validate the Empty Shell**
   Run the following to ensure the environment is healthy:

   ```bash
   pnpm lint
   pnpm typecheck
   pnpm test
   pnpm build
   ```

## Phase 5: Handoff and Verification

1. **Create the First PR**
   Open a PR containing the initialized repo, policies, and base stack integration.
2. **Review against Policies**
   Self-review the PR using `CHECKLIST_PRECOMMIT.md`.

## References

- [wrelik-kit Policies](../../wrelik-kit/docs/policies/README.md)
- [WRELIK_AGENTS.md](../../wrelik-kit/docs/policies/WRELIK_AGENTS.md)
- [Architecture Decisions](../../wrelik-kit/DECISIONS.md)
