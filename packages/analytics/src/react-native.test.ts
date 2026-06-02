import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initAnalytics, capture, capturePageView, isFeatureEnabled, getFeatureFlag, setUserProperties, reset } from './react-native';
import PostHog from 'posthog-react-native';

vi.mock('posthog-react-native', () => {
  return {
    default: {
      initAsync: vi.fn(),
      capture: vi.fn(),
      screen: vi.fn(),
      isFeatureEnabled: vi.fn(() => true),
      getFeatureFlag: vi.fn(() => 'variant-b'),
      onFeatureFlags: vi.fn(),
      reloadFeatureFlags: vi.fn(),
      register: vi.fn(),
      reset: vi.fn(),
    }
  };
});

describe('@wrelik/analytics/react-native', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize PostHog React Native', () => {
    initAnalytics({ apiKey: 'ph_rn_key', host: 'https://test-host.com' });
    expect(PostHog.initAsync).toHaveBeenCalledWith('ph_rn_key', {
      host: 'https://test-host.com',
    });
  });

  it('should capture custom events with validation', () => {
    capture('app.button.click', { id: 'submit' });
    expect(PostHog.capture).toHaveBeenCalledWith('app.button.click', { id: 'submit' });
  });

  it('should throw validation error on invalid event name', () => {
    expect(() => capture('invalid-event')).toThrow();
  });

  it('should capture screen view (page view in mobile)', () => {
    capturePageView('HomeView', { title: 'Home Screen' });
    expect(PostHog.screen).toHaveBeenCalledWith('HomeView', { title: 'Home Screen' });
  });

  it('should check if feature is enabled', () => {
    const enabled = isFeatureEnabled('rn-dashboard');
    expect(enabled).toBe(true);
    expect(PostHog.isFeatureEnabled).toHaveBeenCalledWith('rn-dashboard');
  });

  it('should get feature flag value', () => {
    const flag = getFeatureFlag('rn-dashboard');
    expect(flag).toBe('variant-b');
    expect(PostHog.getFeatureFlag).toHaveBeenCalledWith('rn-dashboard');
  });

  it('should set person properties (super properties via register)', () => {
    setUserProperties({ tier: 'enterprise' });
    expect(PostHog.register).toHaveBeenCalledWith({ tier: 'enterprise' });
  });

  it('should reset session', () => {
    reset();
    expect(PostHog.reset).toHaveBeenCalled();
  });
});
