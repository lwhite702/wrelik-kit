import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

describe('@wrelik/sentry-next/client', () => {
  it('re-exports next sentry client helpers', async () => {
    const init = vi.fn();
    const captureException = vi.fn();
    const captureMessage = vi.fn();
    const setUser = vi.fn();

    vi.doMock('@sentry/nextjs', () => ({
      init,
      captureException,
      captureMessage,
      setUser,
    }));

    const mod = await import('./index.js');
    mod.init({ dsn: 'test' } as never);
    expect(init).toHaveBeenCalledTimes(1);
    expect(mod.captureException).toBe(captureException);
    expect(mod.captureMessage).toBe(captureMessage);
    expect(mod.setUser).toBe(setUser);
  });
});
