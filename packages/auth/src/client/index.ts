import type { ClerkClientSessionLike, WorkflowSession } from '../shared';

function normalizeRoles(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((role): role is string => typeof role === 'string');
}

export function mapClerkToSession(input: unknown): WorkflowSession {
  const auth = (input ?? {}) as ClerkClientSessionLike;

  if (!auth.userId) {
    return { userId: null, tenantId: null, roles: [] };
  }

  return {
    userId: auth.userId,
    tenantId: auth.orgId ?? null,
    roles: normalizeRoles((auth.session?.user?.publicMetadata as { roles?: unknown } | undefined)?.roles),
  };
}
