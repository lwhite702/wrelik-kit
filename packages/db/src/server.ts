/**
 * Server-side database helpers.
 * @module @wrelik/db/server
 */
import { PermissionDeniedError, TenantRequiredError } from '@wrelik/errors';
import type { AccessChecker, TenantContext } from './shared';

export * from './shared';

let accessChecker: AccessChecker = async () => false; // Default deny

export function setTenantAccessChecker(checker: AccessChecker) {
  accessChecker = checker;
}

export async function assertTenantAccess(userId: string, tenantId: string) {
  if (!userId || !tenantId) {
    throw new TenantRequiredError();
  }
  const allowed = await accessChecker(userId, tenantId);
  if (!allowed) {
    throw new PermissionDeniedError(`User ${userId} does not have access to tenant ${tenantId}`);
  }
}

export function withTenant<T>(tenantId: string, fn: (tenantId: string) => Promise<T>): Promise<T> {
  if (!tenantId) {
    throw new TenantRequiredError();
  }
  return fn(tenantId);
}

// Singleton pattern for Prisma
export function getPrismaSingleton<T>(factory: () => T): T {
  const globalForPrisma = global as unknown as { prisma: T };
  const prisma = globalForPrisma.prisma || factory();

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
  }

  return prisma;
}

export function createTenantContext(userId: string, tenantId: string): TenantContext {
  return { userId, tenantId };
}
