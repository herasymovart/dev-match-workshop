---
name: unit-tests
description: Write unit and API (integration) tests for a DevMatch user story (US-01..US-14) or a module - one vitest test per Gherkin scenario and acceptance criterion, named "US-xx sc.N ...", using the shared test DB helpers and supertest. Use when asked to write, add or complete tests for a story, an endpoint, a service or a schema.
argument-hint: US-xx | path/to/module.ts
---

Write tests for `$ARGUMENTS` following `docs/architecture/testing.md`.

## 1. Collect the scenarios

- If `$ARGUMENTS` is a story key: read it in `docs/US-INIT-1.md` / `docs/US-STUD-1.md`; list every acceptance-criteria checkbox and every Gherkin scenario. Read its row in `docs/architecture/traceability.md` and the endpoint(s) in `docs/architecture/api.md`.
- If it is a module path: read the module and the documents it implements (api.md section, domain-model invariants).
- Read the existing tests for the same area (`apps/api/tests`, `packages/shared/src/__tests__`, `apps/web/src/__tests__`) and the helpers in `apps/api/tests/helpers/`.

## 2. Plan before writing (show this, then continue)

A table with one row per future test:

| Test name | Level (unit / API / component) | Arrange (factories) | Act | Assert |
|---|---|---|---|---|
| `US-06 sc.3 approve when no spots left → 409 ROLE_FILLED` | API | project PUBLISHED, role availableSpots=0, app PENDING | `POST /applications/:id/approve` as owner | 409, `error.code`, app still PENDING in DB |

Rules: one scenario = one test; names start with the story key; assert the contract (status, `error.code`, DTO fields present/absent, DB state); if the story touches `availableSpots`, include the `Promise.all` race test from testing.md.

## 3. Write

- Unit tests next to the code in `__tests__/`; API tests in `apps/api/tests/<resource>.test.ts`; component tests in `apps/web/src/__tests__/`.
- Use `resetDb()` in `beforeEach`, factories for data, `supertest.agent` + the real login endpoint for auth. No mocks of Prisma or of services in API tests.
- Missing factory or helper → add it to `tests/helpers/` (small, typed, defaults valid).
- Do not change production code to make a test pass unless the test found a real bug; then say so explicitly and fix the bug in a clearly separate change.

## 4. Run and report

Run `pnpm --filter <package> test -- <story key or file>` and then `pnpm test`. Report:

| Scenario / AC | Test | Result |
|---|---|---|

followed by anything that could not be tested at this level and why (e.g. needs the UI → suggest `/e2e-tests`). If a test fails because the implementation is missing, say "implementation missing" rather than deleting or skipping the test.
