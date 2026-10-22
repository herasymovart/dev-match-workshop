import type { RequestHandler } from 'express';
import type { ZodTypeAny, z } from 'zod';
import { ApiError } from '../lib/errors.js';

/**
 * Validates req.body with a schema from @devmatch/shared and replaces it with the parsed value.
 * On failure → 400 VALIDATION_ERROR with { details: { field: message } } (docs/architecture/api.md).
 */
export function validateBody<S extends ZodTypeAny>(schema: S): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body ?? {});
    if (!result.success) {
      const details: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join('.') || '_';
        details[key] ??= issue.message;
      }
      next(new ApiError('VALIDATION_ERROR', Object.values(details)[0] ?? 'Validation error', details));
      return;
    }
    req.body = result.data as z.infer<S>;
    next();
  };
}
