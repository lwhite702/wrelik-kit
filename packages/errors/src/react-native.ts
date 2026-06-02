/**
 * React Native error handling with Sentry React Native SDK.
 * @module @wrelik/errors/react-native
 */
import * as Sentry from '@sentry/react-native';
import { AppError } from './shared';

export * from './shared';

export function initErrors(
  dsnOrOptions: string | { dsn: string; environment?: string; tracesSampleRate?: number; [key: string]: any },
  options?: { tracesSampleRate?: number; environment?: string }
) {
  let dsn: string;
  let env: string | undefined;
  let sampleRate: number | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let extraOptions: any = {};

  if (typeof dsnOrOptions === 'string') {
    dsn = dsnOrOptions;
    env = options?.environment;
    sampleRate = options?.tracesSampleRate;
  } else {
    dsn = dsnOrOptions.dsn;
    env = dsnOrOptions.environment;
    sampleRate = dsnOrOptions.tracesSampleRate;
    const { dsn: _, environment: __, tracesSampleRate: ___, ...rest } = dsnOrOptions;
    extraOptions = rest;
  }

  Sentry.init({
    dsn,
    tracesSampleRate: sampleRate ?? 1.0,
    environment: env || 'production',
    ...extraOptions,
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
