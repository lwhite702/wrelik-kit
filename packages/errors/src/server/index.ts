import * as Sentry from '@sentry/node';
import { AppError, normalizeError, type ErrorContext } from '../shared';

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
  const normalized = normalizeError(err, context);

  if (err instanceof AppError) {
    if (normalized.statusCode >= 500) {
      Sentry.captureException(err, { extra: normalized.context });
    }
    return;
  }

  Sentry.captureException(err, { extra: normalized.context });
}
