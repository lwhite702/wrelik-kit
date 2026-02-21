// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ErrorContext = Record<string, any>;

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly context?: ErrorContext;

  constructor(message: string, code: string, statusCode = 500, context?: ErrorContext) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.context = context;
  }
}

export class AuthRequiredError extends AppError {
  constructor(message = 'Authentication required', context?: ErrorContext) {
    super(message, 'AUTH_REQUIRED', 401, context);
  }
}

export class TenantRequiredError extends AppError {
  constructor(message = 'Tenant context required', context?: ErrorContext) {
    super(message, 'TENANT_REQUIRED', 400, context);
  }
}

export class PermissionDeniedError extends AppError {
  constructor(message = 'Permission denied', context?: ErrorContext) {
    super(message, 'PERMISSION_DENIED', 403, context);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super(message, 'VALIDATION_ERROR', 400, context);
  }
}
