# DRX Next Consumption (`@wrelik/*`)

DRX (Next.js) should consume `wrelik-kit` through runtime subpaths only. Do not vendor package code into the app repo except as a temporary rollback fallback.

## Runtime import rules

- Server runtime (`route.ts`, server actions, middleware, background handlers): `@wrelik/*/server`
- Browser/client components: `@wrelik/*/client`
- Shared types/validators: `@wrelik/*/shared`

## Example replacements (banned -> allowed)

```ts
// Banned in app repo
import { auth } from '@clerk/nextjs';
import * as Sentry from '@sentry/node';
import { Resend } from 'resend';

// Allowed via wrelik-kit
import { getSession, requireRole } from '@wrelik/auth/server';
import { captureError } from '@wrelik/errors/server';
import { createEmailServer } from '@wrelik/email/server';
```

## Server route example

```ts
import { getSession, requireTenant } from '@wrelik/auth/server';
import { applyTenantScope } from '@wrelik/db/server';
import { captureError } from '@wrelik/errors/server';

export async function GET() {
  try {
    const session = getSession();
    const tenantId = requireTenant(session);
    const where = applyTenantScope(tenantId, { status: 'active' });

    return Response.json({ where });
  } catch (error) {
    captureError(error, { area: 'drx/api/example' });
    return Response.json({ ok: false }, { status: 500 });
  }
}
```

## Client component example

```tsx
'use client';

import { mapClerkToSession } from '@wrelik/auth/client';
import { normalizeError } from '@wrelik/errors/client';

export function SessionSummary({ clerkUser }: { clerkUser: unknown }) {
  try {
    const session = mapClerkToSession(clerkUser);
    return <pre>{JSON.stringify(session, null, 2)}</pre>;
  } catch (error) {
    const normalized = normalizeError(error);
    return <p>{normalized.message}</p>;
  }
}
```

## Shared imports example

```ts
import type { WorkflowSession } from '@wrelik/auth/shared';
import { ValidationError } from '@wrelik/errors/shared';
```

## Enforcement recommendation (app repo)

Add `no-restricted-imports` rules to block direct vendor SDK usage. See [`docs/BANNED_IMPORTS.md`](./BANNED_IMPORTS.md).
