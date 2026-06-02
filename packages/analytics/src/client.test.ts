import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initAnalytics, capture, capturePageView, isFeatureEnabled, getFeatureFlag, setUserProperties, reset } from './client';
import PostHog from 'posthog-js';

vi.mock('posthog-js', () => {
  return {
    default: {
      init: vi.fn(),
      capture: vi.fn(),
      isFeatureEnabled: vi.fn(() => true),
      getFeatureFlag: vi.fn(() => 'variant-a'),
      onFeatureFlags: vi.fn(),
      reloadFeatureFlags: vi.fn(),
      setPersonProperties: vi.fn(),
      reset: vi.fn(),
    }
  };
});

describe('@wrelik/analytics/client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize PostHog', () => {
    initAnalytics({ apiKey: 'ph_key', host: 'https://test-host.com' });
    expect(PostHog.init).toHaveBeenCalledWith('ph_key', {
      api_host: 'https://test-host.com',
    });
  });

  it('should capture custom events with validation', () => {
    capture('app.page.view', { path: '/home' });
    expect(PostHog.capture).toHaveBeenCalledWith('app.page.view', { path: '/home' });
  });

  it('should throw validation error on invalid event name', () => {
    expect(() => capture('invalid-event')).toThrow();
  });

  it('should capture page view', () => {
    capturePageView('/home', { title: 'Home' });
    expect(PostHog.capture).toHaveBeenCalledWith('$pageview', {
      $current_url: '/home',
      title: 'Home',
    });
  });

  it('should check if feature is enabled', () => {
    const enabled = isFeatureEnabled('new-dashboard');
    expect(enabled).toBe(true);
    expect(PostHog.isFeatureEnabled).toHaveBeenCalledWith('new-dashboard', undefined);
  });

  it('should get feature flag value', () => {
    const flag = getFeatureFlag('new-dashboard');
    expect(flag).toBe('variant-a');
    expect(PostHog.getFeatureFlag).toHaveBeenCalledWith('new-dashboard', undefined);
  });

  it('should set person properties', () => {
    setUserProperties({ tier: 'enterprise' });
    expect(PostHog.setPersonProperties).toHaveBeenCalledWith({ tier: 'enterprise' });
  });

  it('should reset session', () => {
    reset();
    expect(PostHog.reset).toHaveBeenCalled();
  });
});
