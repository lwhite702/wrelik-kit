import { describe, expect, it } from 'vitest';
import { PermissionDeniedError, TenantRequiredError } from '@wrelik/errors/shared';
import { createTenantAccessService, withTenantContext, withTransaction } from './index';

describe('@wrelik/db/server', () => {
  it('asserts tenant access with injected checker', async () => {
    const service = createTenantAccessService(async ({ userId, tenantId }) => {
      return userId === 'u1' && tenantId === 't1';
    });

    await expect(service.assertTenantAccess('u1', 't1')).resolves.toBeUndefined();
    await expect(service.assertTenantAccess('', 't1')).rejects.toThrow(TenantRequiredError);
    await expect(service.assertTenantAccess('u1', 't2')).rejects.toThrow(PermissionDeniedError);
  });

  it('runs work through explicit transaction wrappers', async () => {
    const result = await withTransaction<{ txId: string }, string>(
      {
        transaction: async (handler) => handler({ txId: '1' }),
      },
      async (tx) => tx.txId,
    );

    expect(result).toBe('1');
  });

  it('rejects empty tenant contexts', async () => {
    await expect(withTenantContext('', async () => 'ok')).rejects.toThrow(TenantRequiredError);
  });

  it('does not expose root or client subpath imports', () => {
    expect(() => require.resolve('@wrelik/db')).toThrow();
    expect(() => require.resolve('@wrelik/db/client')).toThrow();
  });
});
