import { describe, expect, it } from 'vitest';
import { normalizeError, ValidationError } from './index';

describe('@wrelik/errors/shared', () => {
  it('normalizes AppError shapes and merges context', () => {
    const err = new ValidationError('Bad input', { field: 'email' });
    const normalized = normalizeError(err, { requestId: 'r1' });

    expect(normalized).toEqual({
      name: 'AppError',
      message: 'Bad input',
      code: 'VALIDATION_ERROR',
      statusCode: 400,
      context: { field: 'email', requestId: 'r1' },
    });
  });

  it('normalizes unknown errors to an internal error shape', () => {
    const normalized = normalizeError(new Error('boom'));

    expect(normalized).toEqual({
      name: 'Error',
      message: 'boom',
      code: 'INTERNAL_ERROR',
      statusCode: 500,
      context: undefined,
    });
  });

  it('normalizes non-error throwables with original payload', () => {
    const normalized = normalizeError('boom', { requestId: 'r2' });

    expect(normalized.code).toBe('INTERNAL_ERROR');
    expect(normalized.statusCode).toBe(500);
    expect(normalized.context).toEqual({ requestId: 'r2', originalError: 'boom' });
  });
});
