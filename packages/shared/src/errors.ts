// Error contract: docs/architecture/api.md → "Error-code dictionary".
// Adding a code here without adding it to api.md is a contract violation.

export const ERROR_CODES = {
  VALIDATION_ERROR: 400,
  PROFILE_INCOMPLETE: 400,
  NO_ROLES: 400,
  PROJECT_CLOSED: 400,
  UNAUTHENTICATED: 401,
  INVALID_CREDENTIALS: 401,
  FORBIDDEN: 403,
  OWN_PROJECT: 403,
  NOT_FOUND: 404,
  EMAIL_TAKEN: 409,
  DUPLICATE_ROLE: 409,
  INVALID_STATUS: 409,
  ROLE_FILLED: 409,
  DUPLICATE_APPLICATION: 409,
  ALREADY_DECIDED: 409,
  INTERNAL: 500,
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;

export interface ApiErrorBody {
  error: {
    code: ErrorCode;
    message: string;
    details?: Record<string, string>;
  };
}
