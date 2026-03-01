# Policy Import Guide

Status: Active  
Owner: <TEAM_NAME>  
Last Updated: 2026-02-28  
Applies To: Existing Wrelik applications adopting shared standards

## Purpose

This guide provides a safe procedure for importing `wrelik-kit` policies into an existing repository that already has its own documentation, structure, and history.

## Phase 1: Preparation

1. **Audit Existing Policies**
   Check if your project already has a `docs/policies` folder. If it does, identify any custom policies that should be preserved or merged.

2. **Branching**
   Create a dedicated branch for policy adoption:

   ```bash
   git checkout -b chore/adopt-wrelik-policies
   ```

## Phase 2: Policy Import

1. **Clean Slate (Recommended)**
   If existing policies are outdated or non-standard, it is often easier to start fresh:

   ```bash
   rm -rf ./docs/policies
   ```

2. **Copy New Policies**
   Copy the latest templates from `wrelik-kit`:
   ```bash
   cp -r /path/to/wrelik-kit/docs/policies ./docs/
   ```

## Phase 3: Customization

1. **Replace Placeholders**
   Use a global search and replace in the `./docs/policies` directory to fill in project-specific details:
   - `<APP_NAME>`: Your application name.
   - `<REPO_URL>`: Link to your repository.
   - `<TEAM_NAME>`: The owning team.
   - `<ENV_MATRIX_PATH>`: Path to your environment variable docs.

2. **Metadata Refresh**
   Update the `Last Updated` date to today's date in all imported files.

3. **Verify README**
   Ensure `docs/policies/README.md` correctly reflects the imported files and project state.

## Phase 4: Integration and Audit

1. **Update Root README**
   Add a reference to your new policies in your main `README.md`:

   ```markdown
   ## Policies

   This project follows [Wrelik standardized policies](./docs/policies/README.md).
   ```

2. **Agentic Alignment**
   If you use AI coding assistants, ensure they follow your local `agents.md` which MUST reference the new `WRELIK_AGENTS.md` to govern their behavioral standards.

3. **Fill Integration Record**
   Manually audit your current stack against the and document it in `docs/policies/INTEGRATION_TEMPLATE.md`.

## Phase 5: Verification

- [ ] All placeholders are replaced.
- [ ] Relative links in `README.md` and policy files are working.
- [ ] Policies are committed and visible to the team.

## References

- [wrelik-kit Policies](../../wrelik-kit/docs/policies/README.md)
- [WRELIK_AGENTS.md](./policies/WRELIK_AGENTS.md)
- [App Bootstrap Guide](./APP_BOOTSTRAP_GUIDE.md)
