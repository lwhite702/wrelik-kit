---
description: Import wrelik-kit policies into an existing repository
---

# Workflow: Importing Wrelik Policies

// turbo-all
Follow these steps to bring an existing repository into compliance with `wrelik-kit` policy standards.

## 1. Safety Check

1. If `./docs/policies` exists, back it up or confirm it can be overwritten.

## 2. Copy Policies

1. Copy `docs/policies` from `/Users/lee/Projects/wrelik-kit/docs/policies` to the target repo's `docs/` folder.

## 3. Policy Customization

1. Run a search-and-replace for placeholders in the target `./docs/policies` folder:
   - `<APP_NAME>` -> [Target App Name]
   - `<REPO_URL>` -> [Target Repo URL]
   - `<TEAM_NAME>` -> [Target Team Name]
2. Update the "Last Updated" date in the headers of all policy files to today's date.
3. Update the "Owner" field in all policy files.

## 4. Documentation Integration

1. Add a "Policies" section to the root `README.md` linking to `docs/policies/README.md`.

## 5. Agentic Awareness

1. Ensure the `WRELIK_AGENTS.md` is present.
2. If the repo uses an `agents.md` or similar instruction file, add a directive to follow the `WRELIK_AGENTS.md`.

## 6. Verification

1. Verify all relative links within the `docs/policies` directory.
2. Verify that the policy catalog in `docs/policies/README.md` accurately tracks the files.
