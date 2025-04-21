class AppError extends Error {
  public statusCode: number;
  public code: string;

  constructor(message: string, statusCode = 400, code = "BAD_REQUEST") {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404, "NOT_FOUND");
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401, "UNAUTHORIZED");
  }
}

class ValidationError extends AppError {
  public errors: any[];

  constructor(message = "Validation error", errors: any[] = []) {
    super(message, 400, "VALIDATION_ERROR");
    this.errors = errors;
  }
}

class BadRequestError extends AppError {
  constructor(message = "BadRequest") {
    super(message, 400, "BAD_REQUEST");
  }
}

export {
  AppError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
  BadRequestError,
};
