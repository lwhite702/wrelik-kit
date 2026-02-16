import { describe, it, expect } from 'vitest';
import { requireUser, requireTenant, hasRole } from './shared';

describe('Auth Shared', () => {
  it('requireUser throws if no user', () => {
    expect(() => requireUser(null)).toThrow('Authentication required');
    expect(() => requireUser({ userId: null, tenantId: null, roles: [] })).toThrow(
      'Authentication required',
    );
  });

  it('requireUser returns userId', () => {
    expect(requireUser({ userId: 'u1', tenantId: null, roles: [] })).toBe('u1');
  });

  it('requireTenant throws if no tenant', () => {
    expect(() => requireTenant({ userId: 'u1', tenantId: null, roles: [] })).toThrow(
      'Tenant context required',
    );
  });

  it('hasRole checks roles', () => {
    const session = { userId: 'u1', tenantId: 't1', roles: ['admin'] };
    expect(hasRole(session, 'admin')).toBe(true);
    expect(hasRole(session, 'user')).toBe(false);
  });

  it('does not grant role access when roles has invalid runtime shape', () => {
    const malformedSession = {
      userId: 'u1',
      tenantId: 't1',
      // Simulates untrusted runtime payload, despite the TypeScript type.
      roles: 'admin',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    expect(hasRole(malformedSession, 'admin')).toBe(false);
    expect(hasRole(malformedSession, 'min')).toBe(false);
  });
});
