import type { ErrorRequestHandler } from 'express';
import { ERROR_CODES, type ApiErrorBody, type ErrorCode } from '@devmatch/shared';

/** The only way to produce an error response. Codes and messages: docs/architecture/api.md. */
export class ApiError extends Error {
  readonly status: number;

  constructor(
    readonly code: ErrorCode,
    message: string,
    readonly details?: Record<string, string>,
  ) {
    super(message);
    this.status = ERROR_CODES[code];
  }

  toBody(): ApiErrorBody {
    return { error: { code: this.code, message: this.message, ...(this.details && { details: this.details }) } };
  }
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ApiError) {
    res.status(err.status).json(err.toBody());
    return;
  }
  // Malformed JSON from express.json()
  if (err instanceof SyntaxError && 'status' in err && err.status === 400) {
    res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Malformed JSON in request body' } });
    return;
  }
  console.error(err);
  res.status(500).json({ error: { code: 'INTERNAL', message: 'Internal server error' } } satisfies ApiErrorBody);
};
