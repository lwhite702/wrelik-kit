/**
 * Shared types for database operations.
 * @module @wrelik/db/shared
 */

export interface TenantContext {
  tenantId: string;
  userId: string;
}

export type AccessChecker = (userId: string, tenantId: string) => Promise<boolean>;
