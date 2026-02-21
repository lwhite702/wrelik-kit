/**
 * Server-side auth helpers using @clerk/backend.
 * @module @wrelik/auth/server
 */
import type { SignedInAuthObject, SignedOutAuthObject } from '@clerk/backend';
import { type WorkflowSession } from './shared';

export * from './shared';

export function fromClerkAuth(
  auth: SignedInAuthObject | SignedOutAuthObject | null,
): WorkflowSession {
  if (!auth || !auth.userId) {
    return { userId: null, tenantId: null, roles: [] };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const roles = ((auth.sessionClaims?.publicMetadata as any)?.roles as string[]) || [];

  return {
    userId: auth.userId,
    tenantId: auth.orgId || null,
    roles,
  };
}
