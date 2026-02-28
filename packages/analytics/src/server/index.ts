/* eslint-disable no-restricted-imports */
import { PostHog } from 'posthog-node';
import { validateEventName } from '../shared';

export interface AnalyticsServer {
  identify: (userId: string, traits: Record<string, unknown>) => void;
  capture: (event: string, properties?: Record<string, unknown>, options?: { userId?: string }) => void;
  shutdown: () => void | Promise<void>;
}

export function createAnalyticsServer(apiKey: string, host = 'https://app.posthog.com'): AnalyticsServer {
  const client = new PostHog(apiKey, { host });

  return {
    identify(userId, traits) {
      client.identify({
        distinctId: userId,
        properties: traits,
      });
    },

    capture(event, properties = {}, options) {
      validateEventName(event);
      if (!options?.userId) {
        return;
      }

      client.capture({
        distinctId: options.userId,
        event,
        properties,
      });
    },

    shutdown() {
      return client.shutdown();
    },
  };
}

let analyticsSingleton: AnalyticsServer | null = null;

function requireAnalyticsSingleton(): AnalyticsServer {
  if (!analyticsSingleton) {
    throw new Error(
      '@wrelik/analytics/server compatibility API is not initialized. Call initAnalytics(apiKey, host) before identify/capture/shutdown.',
    );
  }

  return analyticsSingleton;
}

/**
 * @deprecated Temporary DRX compatibility singleton. Prefer createAnalyticsServer(...) and explicit dependency wiring.
 */
export function initAnalytics(apiKey: string, host?: string): void {
  analyticsSingleton = createAnalyticsServer(apiKey, host);
}

/**
 * @deprecated Temporary DRX compatibility singleton. Prefer createAnalyticsServer(...).identify(...)
 */
export function identify(userId: string, traits: Record<string, unknown>): void {
  requireAnalyticsSingleton().identify(userId, traits);
}

/**
 * @deprecated Temporary DRX compatibility singleton. Prefer createAnalyticsServer(...).capture(...)
 */
export function capture(
  event: string,
  properties?: Record<string, unknown>,
  options?: { userId?: string },
): void {
  requireAnalyticsSingleton().capture(event, properties, options);
}

/**
 * @deprecated Temporary DRX compatibility singleton. Prefer createAnalyticsServer(...).shutdown()
 */
export async function shutdown(): Promise<void> {
  await Promise.resolve(requireAnalyticsSingleton().shutdown());
}
