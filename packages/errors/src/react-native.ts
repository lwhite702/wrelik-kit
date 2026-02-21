/**
 * React Native error handling with Sentry React Native SDK.
 * @module @wrelik/errors/react-native
 */
import * as Sentry from '@sentry/react-native';
import { AppError } from './shared';

export * from './shared';

export function initErrors(config: { dsn: string; environment?: string; tracesSampleRate?: number }) {
  Sentry.init({
    dsn: config.dsn,
    environment: config.environment || 'production',
    tracesSampleRate: config.tracesSampleRate ?? 1.0,
  });
}

export function setUserContext(user: { id: string; email?: string } | null) {
  Sentry.setUser(user);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function captureError(err: unknown, context?: Record<string, any>) {
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      Sentry.captureException(err, { extra: { ...err.context, ...context } });
    } else {
      console.warn(`[${err.code}] ${err.message}`, { context: err.context, ...context });
    }
  } else {
    Sentry.captureException(err, { extra: context });
  }
}

export { Sentry };
