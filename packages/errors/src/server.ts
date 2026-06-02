/**
 * Server-side error handling with Sentry Node SDK.
 * @module @wrelik/errors/server
 */
import * as Sentry from '@sentry/node';
import { AppError } from './shared';

export * from './shared';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function captureError(err: unknown, context?: Record<string, any>) {
  if (err instanceof AppError) {
    // Basic logging for expected app errors
    console.warn(`[${err.code}] ${err.message}`, { context: err.context, ...context });
    // Still capture if it's 500 or critical? Maybe optional.
    if (err.statusCode >= 500) {
      Sentry.captureException(err, { extra: { ...err.context, ...context } });
    }
  } else {
    // Unexpected errors
    console.error('Unexpected error:', err);
    Sentry.captureException(err, { extra: context });
  }
}

export function setUserContext(user: { id: string; email?: string } | null) {
  Sentry.setUser(user);
}

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
    environment: env,
    ...extraOptions,
  });
}

export { Sentry };
