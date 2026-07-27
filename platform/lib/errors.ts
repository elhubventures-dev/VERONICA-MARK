export class AppError extends Error {
  readonly code: string;
  readonly statusCode: number;
  readonly details?: unknown;
  readonly isOperational: boolean;

  constructor(
    message: string,
    options: {
      code?: string;
      statusCode?: number;
      details?: unknown;
      isOperational?: boolean;
      cause?: unknown;
    } = {},
  ) {
    super(message, { cause: options.cause });
    this.name = "AppError";
    this.code = options.code ?? "APP_ERROR";
    this.statusCode = options.statusCode ?? 500;
    this.details = options.details;
    this.isOperational = options.isOperational ?? true;
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed", details?: unknown) {
    super(message, { code: "VALIDATION_ERROR", statusCode: 400, details });
    this.name = "ValidationError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required") {
    super(message, { code: "UNAUTHORIZED", statusCode: 401 });
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You do not have permission to perform this action") {
    super(message, { code: "FORBIDDEN", statusCode: 403 });
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, { code: "NOT_FOUND", statusCode: 404 });
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource conflict") {
    super(message, { code: "CONFLICT", statusCode: 409 });
    this.name = "ConflictError";
  }
}

export class RateLimitedError extends AppError {
  constructor(message = "Too many requests. Please try again later") {
    super(message, { code: "RATE_LIMITED", statusCode: 429 });
    this.name = "RateLimitedError";
  }
}

export function toErrorResponse(error: unknown): {
  statusCode: number;
  body: { error: { code: string; message: string; details?: unknown } };
} {
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      body: {
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
    };
  }

  return {
    statusCode: 500,
    body: {
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred",
      },
    },
  };
}
