/**
 * @wrelik/auth root entrypoint.
 * 
 * Exports shared types and helpers only.
 * For server-side auth, use:
 * - @wrelik/auth/server (Node.js with @clerk/backend)
 * - @wrelik/auth/next (Next.js server components)
 * 
 * For client-side auth, use:
 * - @wrelik/auth/client (Browser/React Native)
 * - @wrelik/auth/react-native (React Native)
 * 
 * @deprecated Direct imports from root will be removed in a future version.
 * Use specific subpaths for your environment.
 */
export * from './shared';
export { fromClerkAuth } from './server';
export { mapClerkToSession } from './client';
