---
description: Start a new project following wrelik-kit policies
---

# Workflow: Bootstrapping a New Project

// turbo-all
Follow these steps to initialize a new repository and ensure it follows `wrelik-kit` standards.

## 1. Directory Setup

1. Create a new directory for the project.
2. Initialize git.
3. Initialize pnpm.

## 2. Policy Adoption

1. Copy `docs/policies` from `/Users/lee/Projects/wrelik-kit/docs/policies` to the new project's `docs/` folder.
2. Run a search-and-replace for placeholders in the new `docs/policies` folder:
   - `<APP_NAME>` -> [Your App Name]
   - `<REPO_URL>` -> [Your Repo URL]
   - `<TEAM_NAME>` -> [Your Team Name]
3. Update the "Last Updated" date in the headers of all policy files to today's date.

## 3. Core Dependencies

1. Install standard `@wrelik/*` packages.
2. Install shared configuration packages (`@wrelik/tsconfig`, `@wrelik/eslint-config`).

## 4. Integration Template

1. Create a draft of `docs/policies/INTEGRATION_TEMPLATE.md` specifically for this app.
2. Document the intended initialization order.

## 5. Verification

1. Run `pnpm install`.
2. Verify that `docs/policies/README.md` is present and correctly catalogs the policies.
3. Ensure `WRELIK_AGENTS.md` is visible to any subsequent agentic work.
