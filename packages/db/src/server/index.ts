import { PermissionDeniedError, TenantRequiredError } from '@wrelik/errors/shared';
import type { TenantAccessChecker, TransactionExecutor } from '../shared';

export function createTenantAccessService(checker: TenantAccessChecker) {
  return {
    async assertTenantAccess(userId: string, tenantId: string): Promise<void> {
      if (!userId || !tenantId) {
        throw new TenantRequiredError();
      }

      const allowed = await checker({ userId, tenantId });

      if (!allowed) {
        throw new PermissionDeniedError(`User ${userId} does not have access to tenant ${tenantId}`);
      }
    },
  };
}

export async function withTenantContext<T>(tenantId: string, handler: (tenantId: string) => Promise<T>) {
  if (!tenantId) {
    throw new TenantRequiredError();
  }

  return handler(tenantId);
}

export async function withTransaction<TClient, T>(
  executor: TransactionExecutor<TClient>,
  handler: (tx: TClient) => Promise<T>,
): Promise<T> {
  return executor.transaction(handler);
}
