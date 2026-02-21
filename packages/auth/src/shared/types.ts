export interface WorkflowSession {
  userId: string | null;
  tenantId: string | null;
  roles: string[];
}

export interface ClerkSessionLike {
  userId?: string | null;
  orgId?: string | null;
  sessionClaims?: unknown;
}

export interface ClerkClientSessionLike {
  userId?: string | null;
  orgId?: string | null;
  session?: {
    user?: {
      publicMetadata?: unknown;
    };
  };
}
