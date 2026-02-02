import { AuthRequiredError, PermissionDeniedError, TenantRequiredError } from '@wrelik/errors';
import type { SignedInAuthObject, SignedOutAuthObject } from '@clerk/backend';

export interface WorkflowSession {
  userId: string | null;
  tenantId: string | null;
  roles: string[];
}

export function fromClerkAuth(
  auth: SignedInAuthObject | SignedOutAuthObject | null,
): WorkflowSession {
  if (!auth || !auth.userId) {
    return { userId: null, tenantId: null, roles: [] };
  }

  const roles = ((auth.sessionClaims?.publicMetadata as any)?.roles as string[]) || [];

  return {
    userId: auth.userId,
    tenantId: auth.orgId || null,
    roles,
  };
}

export function requireUser(session: WorkflowSession | null): string {
  if (!session || !session.userId) {
    throw new AuthRequiredError();
  }
  return session.userId;
}

export function requireTenant(session: WorkflowSession | null): string {
  requireUser(session);
  if (!session || !session.tenantId) {
    throw new TenantRequiredError();
  }
  return session.tenantId;
}

export function hasRole(session: WorkflowSession | null, role: string): boolean {
  if (!session || !session.userId) return false;
  return session.roles.includes(role);
}

export function requireRole(session: WorkflowSession | null, role: string) {
  if (!hasRole(session, role)) {
    throw new PermissionDeniedError(`Role ${role} required`);
  }
}
