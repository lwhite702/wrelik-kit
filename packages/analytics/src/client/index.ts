import { validateEventName } from '../shared';

export interface AnalyticsClient {
  identify: (userId: string, traits?: Record<string, unknown>) => void;
  capture: (event: string, properties?: Record<string, unknown>) => void;
}

export interface AnalyticsClientAdapter {
  identify?: (userId: string, traits?: Record<string, unknown>) => void;
  capture?: (event: string, properties?: Record<string, unknown>) => void;
}

export function createAnalyticsClient(adapter: AnalyticsClientAdapter): AnalyticsClient {

  return {
    identify(userId, traits) {
      adapter.identify?.(userId, traits);
    },

    capture(event, properties = {}) {
      validateEventName(event);
      adapter.capture?.(event, properties);
    },
  };
}
