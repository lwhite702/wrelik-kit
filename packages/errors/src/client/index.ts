import * as Sentry from '@sentry/browser';
import { AppError, type ErrorContext } from '../shared';

export function initErrors(config: { dsn: string; tracesSampleRate?: number }): void {
  Sentry.init({
    dsn: config.dsn,
    tracesSampleRate: config.tracesSampleRate ?? 1,
  });
}

export function setUserContext(user: { id: string; email?: string } | null): void {
  Sentry.setUser(user);
}

export function captureError(err: unknown, context?: ErrorContext): void {
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      Sentry.captureException(err, { extra: { ...err.context, ...context } });
    }
    return;
  }

  Sentry.captureException(err, { extra: context });
}
