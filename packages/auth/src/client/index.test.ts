import { describe, expect, it } from 'vitest';
import { mapClerkToSession } from './index';

describe('@wrelik/auth/client', () => {
  it('maps unknown auth input to a safe empty session', () => {
    expect(mapClerkToSession(null)).toEqual({ userId: null, tenantId: null, roles: [] });
  });

  it('maps role metadata without permission checks', () => {
    const session = mapClerkToSession({
      userId: 'u1',
      orgId: 'o1',
      session: { user: { publicMetadata: { roles: ['admin', 1] } } },
    });

    expect(session).toEqual({ userId: 'u1', tenantId: 'o1', roles: ['admin'] });
  });
});
