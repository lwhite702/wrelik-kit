import { describe, expect, it } from 'vitest';
import { mapClerkToSession } from './index';

describe('@wrelik/auth/client contract', () => {
  it('normalizes mixed roles from Clerk client payload', () => {
    const session = mapClerkToSession({
      userId: 'u1',
      orgId: 't1',
      session: {
        user: {
          publicMetadata: {
            roles: ['admin', 42, 'owner'],
          },
        },
      },
    });

    expect(session).toEqual({
      userId: 'u1',
      tenantId: 't1',
      roles: ['admin', 'owner'],
    });
  });
});
