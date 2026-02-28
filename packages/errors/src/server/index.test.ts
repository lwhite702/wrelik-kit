import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

describe('@wrelik/errors/server', () => {
  it('captures unexpected errors through the server Sentry SDK', async () => {
    const captureException = vi.fn();
    vi.doMock('@sentry/node', () => ({
      default: {},
      captureException,
      init: vi.fn(),
      setUser: vi.fn(),
    }));

    const mod = await import('./index.js');
    mod.captureError(new Error('boom'), { requestId: 'r1' });

    expect(captureException).toHaveBeenCalledTimes(1);
    expect(captureException.mock.calls[0][1]).toEqual({ extra: { requestId: 'r1' } });
  });

  it('does not capture handled 4xx AppError instances', async () => {
    const captureException = vi.fn();
    vi.doMock('@sentry/node', () => ({
      default: {},
      captureException,
      init: vi.fn(),
      setUser: vi.fn(),
    }));

    const mod = await import('./index.js');
    const { ValidationError } = await import('../shared/index.js');
    mod.captureError(new ValidationError('bad input'));

    expect(captureException).not.toHaveBeenCalled();
  });
});
