# Adding a New Adapter Package (Boundary-Safe)

Use this checklist when adding a new runtime adapter package to `wrelik-kit`.

## Required Package Shape

Create these entrypoints:

- `src/server/index.ts`
- `src/client/index.ts`
- `src/shared/index.ts`

Package `exports` must include only:

- `./server`
- `./client`
- `./shared`
- `./package.json`

Do not add a root `"."` export for runtime adapters.

## Client Safety Requirements

- `client` must be Expo-safe (no Node built-ins, no server SDKs)
- No imports from `@wrelik/*/server` inside `client`
- If the adapter is server-only, `src/client/index.ts` must be a fail-fast stub that throws on import with a clear message

## Contract Test Minimums

Add package-local Vitest tests that cover:

- Public runtime contract behavior (`server`, `client`, `shared` as applicable)
- Error/failure modes
- Boundary behavior (forbidden root import, fail-fast client stub if server-only)
- Any normalization/validation helpers used by app code

Prefer dependency injection seams for vendor SDK interactions so tests remain deterministic.

## Changesets Requirements

- Add a Changeset for any publishable package change
- Choose SemVer impact based on contract change severity
- Keep summary factual (what changed and why apps care)

## CI Gates That Must Pass

```bash
pnpm check:workspace-integrity
pnpm check:runtime-contracts
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm check:bundles
pnpm check:cycles
```

## Example Fail-Fast Client Stub (Server-only Adapter)

```ts
export const serverOnlyClientStub = (() => {
  throw new Error(
    '@wrelik/example/client is a server-only adapter stub. Use @wrelik/example/server on the backend and call your backend API from client or Expo apps.',
  );
})();
```
