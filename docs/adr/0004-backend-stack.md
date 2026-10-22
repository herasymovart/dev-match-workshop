# ADR-0004: Backend — Node 20 + Express 5 + TypeScript, zod, REST/JSON, single error format

**Status:** accepted
**Date:** 2026-10-22

## Context
An API with ~14 endpoints; exact error codes (400/401/403/404/409) are part of the requirements (US-05, US-08, US-11, US-12). Validation must match the frontend (ADR-0002). The team knows Express.

## Options
### A. Express 5 + zod
+ familiar to the team; Express 5 natively handles errors from async handlers (less boilerplate)
+ zod schemas live in `packages/shared` and are used both in forms and in middleware
− no built-in validation/OpenAPI — we write a small middleware ourselves

### B. Fastify + TypeBox/zod
+ faster, schemas built in, generates OpenAPI
− a plugin model new to the team; the performance advantages are not needed here

### C. NestJS
+ structure "out of the box", DI, decorators
− a significant learning curve; excessive for 14 endpoints; Claude Code generates more code that the team does not understand

### API style: REST/JSON vs GraphQL/tRPC
REST: matches the requirements, which are formulated in terms of HTTP codes; understandable in DevTools. tRPC would give end-to-end typing but hides the HTTP codes that are explicit in the requirements. **REST.**

## Decision
**A.** Rules:
- all request bodies are validated with a zod schema from `packages/shared` before entering the handler;
- all errors are `{ "error": { "code": "STRING_CODE", "message": "text in English" } }`; codes and texts are in `docs/architecture/api.md`;
- layers: `routes` (HTTP) → `services` (business rules, transactions) → Prisma. There are no business rules in routes.

## Consequences
+ the frontend can show `error.message` directly — the texts are already English translations of the acceptance-criteria texts
− we do not generate an OpenAPI specification; the contract is `api.md` (enough for a team of 4)

## Related stories
all; explicitly about error codes — US-05, US-08, US-11, US-12
