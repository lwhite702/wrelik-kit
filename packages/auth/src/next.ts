/**
 * Next.js server component auth helpers.
 * @module @wrelik/auth/next
 */
/* eslint-disable no-restricted-imports */
import { auth } from '@clerk/nextjs';
import { fromClerkAuth, type WorkflowSession } from './server';

export * from './shared';

export function getSession(): WorkflowSession {
  const clerkAuth = auth();
  return fromClerkAuth(clerkAuth);
}
