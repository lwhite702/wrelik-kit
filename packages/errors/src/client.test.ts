import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initErrors } from './client';
import * as Sentry from '@sentry/browser';

vi.mock('@sentry/browser', () => ({
  init: vi.fn(),
  captureException: vi.fn(),
  setUser: vi.fn(),
}));

describe('@wrelik/errors/client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize Sentry with a DSN string', () => {
    initErrors('https://example-dsn.com');
    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        dsn: 'https://example-dsn.com',
        tracesSampleRate: 1.0,
      })
    );
  });

  it('should initialize Sentry with an options object', () => {
    initErrors({
      dsn: 'https://example-dsn.com',
      environment: 'staging',
      tracesSampleRate: 0.5,
      debug: true,
    });
    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        dsn: 'https://example-dsn.com',
        environment: 'staging',
        tracesSampleRate: 0.5,
        debug: true,
      })
    );
  });
});
