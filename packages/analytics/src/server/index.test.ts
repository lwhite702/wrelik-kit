import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

describe('@wrelik/analytics/server', () => {
  it('compatibility singleton throws before initAnalytics', async () => {
    const mod = await import('./index.js');
    expect(() => mod.capture('drx.user.created', { plan: 'pro' }, { userId: 'u1' })).toThrow(/initAnalytics/i);
  });

  it('compatibility singleton delegates to the PostHog-backed server after initAnalytics', async () => {
    const identify = vi.fn();
    const capture = vi.fn();
    const shutdown = vi.fn(async () => undefined);
    const PostHog = vi.fn(function PostHogMock() {
      return { identify, capture, shutdown };
    });

    vi.doMock('posthog-node', () => ({ PostHog }));

    const mod = await import('./index.js');
    mod.initAnalytics('ph_test', 'https://posthog.example');
    mod.identify('u1', { role: 'admin' });
    mod.capture('drx.user.created', { source: 'web' }, { userId: 'u1' });
    await mod.shutdown();

    expect(PostHog).toHaveBeenCalledWith('ph_test', { host: 'https://posthog.example' });
    expect(identify).toHaveBeenCalledWith({
      distinctId: 'u1',
      properties: { role: 'admin' },
    });
    expect(capture).toHaveBeenCalledWith({
      distinctId: 'u1',
      event: 'drx.user.created',
      properties: { source: 'web' },
    });
    expect(shutdown).toHaveBeenCalledTimes(1);
  });
});
