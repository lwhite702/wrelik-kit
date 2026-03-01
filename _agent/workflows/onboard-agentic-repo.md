---
description: Quickly onboard an existing repo into the Wrelik agentic ecosystem
---

# Workflow: Onboarding an Agentic Repo

// turbo-all
Use this workflow to quickly install the necessary policy and agent frameworks into a repository.

## 1. Import Policies

1. Copy the entire `docs/policies` folder from `/Users/lee/Projects/wrelik-kit/docs/policies` to the target repo's `docs/` folder.
2. Replace placeholders in all files under the new `docs/policies` folder:
   - `<APP_NAME>` -> [App Name]
   - `<REPO_URL>` -> [Repo URL]
   - `<TEAM_NAME>` -> [Team Name]

## 2. Initialize Project agents.md

1. Copy `docs/policies/AGENTS_TEMPLATE.md` to the target repo's root as `agents.md`.
2. Update the `agents.md` with:
   - `<APP_NAME>` -> [App Name]
   - Refined "Core Technology Stack" based on what you find in `package.json`.
3. Ensure the relative link to `./docs/policies/WRELIK_AGENTS.md` is correct (this is standard if following step 1).

## 3. README Integration

1. Add a "Policies and Agents" section to the root `README.md`:

   ```markdown
   ## Policies & Agents

   This project follows [Wrelik standardized policies](./docs/policies/README.md).
   AI agents and human contributors follow rules defined in [WRELIK_AGENTS.md](./docs/policies/WRELIK_AGENTS.md) and project-specific contexts in [agents.md](./agents.md).
   ```

## 4. Verification

1. Run `pnpm install` (optional but recommended to ensure lockfile is healthy).
2. Confirm `agents.md` is at the root and `docs/policies/` is complete.
3. Validate that the next task you undertake follows the newly imported `WRELIK_AGENTS.md` process.
