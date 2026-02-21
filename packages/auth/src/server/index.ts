/* eslint-disable no-restricted-imports */
import type { SignedInAuthObject, SignedOutAuthObject } from '@clerk/backend';
import { auth } from '@clerk/nextjs';
import { AuthRequiredError, PermissionDeniedError, TenantRequiredError } from '@wrelik/errors/shared';
import type { ClerkSessionLike, WorkflowSession } from '../shared';

function normalizeRoles(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((role): role is string => typeof role === 'string');
}

export function fromClerkAuth(clerkAuth: SignedInAuthObject | SignedOutAuthObject | null): WorkflowSession {
  if (!clerkAuth?.userId) {
    return { userId: null, tenantId: null, roles: [] };
  }

  const authLike: ClerkSessionLike = clerkAuth;
  const claims = (authLike.sessionClaims as { publicMetadata?: { roles?: unknown } } | undefined) ?? {};

  return {
    userId: clerkAuth.userId,
    tenantId: clerkAuth.orgId ?? null,
    roles: normalizeRoles(claims.publicMetadata?.roles),
  };
}

export function getSession(): WorkflowSession {
  return fromClerkAuth(auth());
}

export function requireUser(session: WorkflowSession | null): string {
  if (!session?.userId) {
    throw new AuthRequiredError();
  }

  return session.userId;
}

export function requireTenant(session: WorkflowSession | null): string {
  requireUser(session);

  if (!session?.tenantId) {
    throw new TenantRequiredError();
  }

  return session.tenantId;
}

export function hasRole(session: WorkflowSession | null, role: string): boolean {
  return Boolean(session?.userId && Array.isArray(session.roles) && session.roles.includes(role));
}

export function requireRole(session: WorkflowSession | null, role: string): void {
  if (!hasRole(session, role)) {
    throw new PermissionDeniedError(`Role ${role} required`);
  }
}
