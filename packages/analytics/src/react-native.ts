import PostHog from 'posthog-react-native';
import { validateEventName } from './shared';

export function initAnalytics(apiKey: string, host = 'https://app.posthog.com') {
  PostHog.initAsync(apiKey, {
    host,
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function identify(userId: string, traits?: Record<string, any>) {
  // @ts-ignore - PostHog RN types might be missing or different version
  PostHog.identify(userId, traits);
}

export function capture(
  event: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties: Record<string, any> = {},
  options?: { userId?: string; tenantId?: string },
) {
  validateEventName(event);

  // merge options into properties if needed, or handle separately if PostHog RN supports it
  // Usually capturing with explicit distinctId requires identifying first
  if (options?.userId) {
    // Optional: re-identify? No, usually not done on every capture unless user switched
  }

  // @ts-ignore - PostHog RN types might be missing or different version
  PostHog.capture(event, properties);
}

export async function shutdown() {
  // PostHog RN doesn't need explicit shutdown usually
}
