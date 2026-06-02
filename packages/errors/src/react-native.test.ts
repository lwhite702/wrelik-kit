import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initErrors } from './react-native';
import * as Sentry from '@sentry/react-native';

vi.mock('@sentry/react-native', () => ({
  init: vi.fn(),
  captureException: vi.fn(),
  setUser: vi.fn(),
}));

describe('@wrelik/errors/react-native', () => {
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
