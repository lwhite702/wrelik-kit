import { describe, it, expect } from 'vitest';
import {
  AppError,
  AuthRequiredError,
  TenantRequiredError,
  PermissionDeniedError,
  ValidationError,
} from './shared';

describe('@wrelik/errors/shared', () => {
  it('AppError should set base properties correctly', () => {
    const error = new AppError('Something went wrong', 'TEST_ERROR', 500, { foo: 'bar' });
    expect(error.message).toBe('Something went wrong');
    expect(error.code).toBe('TEST_ERROR');
    expect(error.statusCode).toBe(500);
    expect(error.context).toEqual({ foo: 'bar' });
  });

  it('AuthRequiredError should set default properties correctly', () => {
    const error = new AuthRequiredError();
    expect(error.message).toBe('Authentication required');
    expect(error.code).toBe('AUTH_REQUIRED');
    expect(error.statusCode).toBe(401);
  });

  it('TenantRequiredError should set default properties correctly', () => {
    const error = new TenantRequiredError();
    expect(error.message).toBe('Tenant context required');
    expect(error.code).toBe('TENANT_REQUIRED');
    expect(error.statusCode).toBe(400);
  });

  it('PermissionDeniedError should set default properties correctly', () => {
    const error = new PermissionDeniedError();
    expect(error.message).toBe('Permission denied');
    expect(error.code).toBe('PERMISSION_DENIED');
    expect(error.statusCode).toBe(403);
  });

  it('ValidationError should set default properties correctly', () => {
    const error = new ValidationError('Invalid email address');
    expect(error.message).toBe('Invalid email address');
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.statusCode).toBe(400);
  });
});
