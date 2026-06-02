/**
 * Client-side analytics helpers using PostHog Browser SDK.
 * @module @wrelik/analytics/client
 */
import PostHog from "posthog-js";
import { validateEventName, type AnalyticsConfig } from "./shared";

export * from "./shared";

let initialized = false;

export function initAnalytics(config: AnalyticsConfig) {
  if (initialized) return;
  
  PostHog.init(config.apiKey, {
    api_host: config.host || "https://app.posthog.com",
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function capturePageView(url: string, properties: Record<string, any> = {}) {
  PostHog.capture("$pageview", { $current_url: url, ...properties });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isFeatureEnabled(key: string, options?: any): boolean {
  return PostHog.isFeatureEnabled(key, options) ?? false;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getFeatureFlag(key: string, options?: any): any {
  return PostHog.getFeatureFlag(key, options);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function onFeatureFlags(callback: (flags: string[], variants: Record<string, any>) => void) {
  PostHog.onFeatureFlags(callback);
}

export function reloadFeatureFlags() {
  PostHog.reloadFeatureFlags();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setUserProperties(properties: Record<string, any>) {
  PostHog.setPersonProperties(properties);
}

export function reset() {
  PostHog.reset();
}

export function shutdown() {
  // PostHog JS doesn't need explicit shutdown
}

export { PostHog };
