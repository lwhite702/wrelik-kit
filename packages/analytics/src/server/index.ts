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
