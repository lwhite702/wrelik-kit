import { describe, expect, it } from 'vitest';
import { AuthRequiredError, PermissionDeniedError, TenantRequiredError } from '@wrelik/errors/shared';
import { fromClerkAuth, hasRole, requireRole, requireTenant, requireUser } from './index';

describe('@wrelik/auth/server', () => {
  it('requires authenticated users and tenant contexts', () => {
    expect(() => requireUser(null)).toThrow(AuthRequiredError);
    expect(() => requireTenant({ userId: 'u1', tenantId: null, roles: [] })).toThrow(TenantRequiredError);
  });

  it('checks role membership with runtime-shape safety', () => {
    expect(hasRole({ userId: 'u1', tenantId: 't1', roles: ['admin'] }, 'admin')).toBe(true);
    expect(() => requireRole({ userId: 'u1', tenantId: 't1', roles: [] }, 'admin')).toThrow(
      PermissionDeniedError,
    );
  });

  it('maps Clerk auth payloads defensively', () => {
    const session = fromClerkAuth({
      userId: 'u1',
      orgId: 'o1',
      sessionClaims: { publicMetadata: { roles: ['admin', 1] } },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    expect(session).toEqual({ userId: 'u1', tenantId: 'o1', roles: ['admin'] });
  });

  it('does not expose a root package import', () => {
    expect(() => require.resolve('@wrelik/auth')).toThrow();
  });
});
