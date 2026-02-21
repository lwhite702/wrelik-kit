/**
 * Client-side analytics helpers using PostHog Browser SDK.
 * @module @wrelik/analytics/client
 */
import PostHog from 'posthog-js';
import { validateEventName, type AnalyticsConfig } from './shared';

export * from './shared';

let initialized = false;

export function initAnalytics(config: AnalyticsConfig) {
  if (initialized) return;
  
  PostHog.init(config.apiKey, {
    api_host: config.host || 'https://app.posthog.com',
  });
  initialized = true;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function identify(userId: string, traits?: Record<string, any>) {
  PostHog.identify(userId, traits);
}

export function capture(
  event: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties: Record<string, any> = {},
) {
  validateEventName(event);
  PostHog.capture(event, properties);
}

export function shutdown() {
  // PostHog JS doesn't need explicit shutdown
}

export { PostHog };
