import express from 'express';
import request from 'supertest';
import { updateProfileSchema } from '@devmatch/shared';
import { createApp } from '../src/app.js';
import { errorHandler } from '../src/lib/errors.js';
import { validateBody } from '../src/middleware/validate.js';

// Tests for the skeleton's HTTP contract: docs/architecture/api.md → "Error format".

describe('GET /api/health', () => {
  it('returns { ok: true }', async () => {
    const res = await request(createApp()).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });
});

describe('api.md "Error format": every error is { error: { code, message } }', () => {
  it('unknown /api route → 404 NOT_FOUND in the documented shape', async () => {
    const res = await request(createApp()).get('/api/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: { code: 'NOT_FOUND', message: 'Resource not found' } });
  });

  it('malformed JSON body → 400 VALIDATION_ERROR, no stack trace leaks', async () => {
    const res = await request(createApp())
      .post('/api/health')
      .set('Content-Type', 'application/json')
      .send('{not json');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(JSON.stringify(res.body)).not.toMatch(/at .*\.js/);
  });
});

describe('validateBody middleware (ADR-0004: validation only through shared schemas)', () => {
  // The middleware and the error handler are unit-tested on a minimal app, without the real routes.
  function appWithRoute() {
    return express()
      .use(express.json())
      .patch('/test/me', validateBody(updateProfileSchema), (req, res) => res.json({ body: req.body }))
      .use(errorHandler);
  }

  it('invalid body → 400 VALIDATION_ERROR with details per field (US-01 sc.3 message)', async () => {
    const res = await request(appWithRoute()).patch('/test/me').send({ telegram: 'orest lead!' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.details).toEqual({
      telegram: 'Username must be 5–32 characters (Latin letters, digits, _)',
    });
  });

  it('valid body is replaced by the parsed, normalized value (US-01 sc.1: "orest_lead" → "@orest_lead")', async () => {
    const res = await request(appWithRoute()).patch('/test/me').send({ telegram: 'orest_lead' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ body: { telegram: '@orest_lead' } });
  });
});
