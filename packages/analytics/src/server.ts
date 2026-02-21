/**
 * Server-side analytics helpers using PostHog Node SDK.
 * @module @wrelik/analytics/server
 */
/* eslint-disable no-restricted-imports */
import { PostHog } from 'posthog-node';
import { validateEventName, type AnalyticsConfig } from './shared';

export * from './shared';

let client: PostHog | null = null;

export function initAnalytics(config: AnalyticsConfig) {
  client = new PostHog(config.apiKey, { 
    host: config.host || 'https://app.posthog.com' 
  });
}

function getClient(safe = false) {
  if (!client && !safe) {
    throw new Error('Analytics not initialized. Call initAnalytics first.');
  }
  return client;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function identify(userId: string, traits: Record<string, any>) {
  getClient(true)?.identify({
    distinctId: userId,
    properties: traits,
  });
}

export function capture(
  event: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties: Record<string, any> = {},
  options?: { userId?: string },
) {
  // Validate naming convention: app.action.object
  validateEventName(event);

  // If no user is provided, we can't capture server-side easily without anonymous ID
  // But usually servers have a userId context.
  if (!options?.userId) {
    console.warn('Analytics capture called without userId');
    return;
  }

  getClient(true)?.capture({
    distinctId: options.userId,
    event,
    properties,
  });
}

export async function shutdown() {
  await getClient(true)?.shutdown();
}

export { client as postHogClient };
