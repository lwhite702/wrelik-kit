/**
 * Client-side auth helpers (no backend SDK imports).
 * @module @wrelik/auth/client
 */
import { type WorkflowSession } from './shared';

export * from './shared';

/**
 * Maps a client-side Clerk session to WorkflowSession.
 * Use this in React components that have access to Clerk's useAuth/useUser hooks.
 */
export function mapClerkToSession(
  auth: {
    userId?: string | null;
    orgId?: string | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    session?: { user?: { publicMetadata?: any } };
  } | null,
): WorkflowSession {
  if (!auth || !auth.userId) {
    return { userId: null, tenantId: null, roles: [] };
  }

  // The roles might be in publicMetadata of the user object in session
  const roles = (auth.session?.user?.publicMetadata?.roles as string[]) || [];

  return {
    userId: auth.userId,
    tenantId: auth.orgId || null,
    roles,
  };
}
