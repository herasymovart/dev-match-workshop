# DevMatch — testing strategy

**For whom:** everyone who writes code. This is the technique: which test goes where, how it is named, and how it proves a requirement. The Gherkin scenarios in `docs/US-*.md` are the source; a test that does not trace back to a scenario or an acceptance criterion needs a reason to exist.

## The pyramid for this project

| Level | What it proves | Where | Tooling | Speed | Share |
|---|---|---|---|---|---|
| **Unit** | pure rules: validation schemas, normalization, DTO serializers, pure helpers | `packages/shared/src/__tests__`, `apps/api/src/**/__tests__` | vitest | ms | many |
| **API (integration)** | one endpoint end to end: HTTP → validation → service → DB → DTO, with real SQLite | `apps/api/tests/*.test.ts` | vitest + supertest + Prisma on a test DB | ~10 ms each | most story tests live here |
| **Component** | a page renders the right state for given data (empty state, badge colors, disabled buttons) | `apps/web/src/__tests__` | vitest + jsdom + Testing Library | ms | a few per page |
| **End-to-end** | one user journey through the real browser and the real API | `e2e/*.spec.ts` | Playwright | seconds | 2–3 journeys total |

Why most story tests are API tests: every acceptance criterion in this project is phrased as a server behavior (status code, counter change, field absent from JSON). An API test checks exactly that, with no mocks, and runs fast on SQLite.

## From Gherkin to a test (the technique)

1. Take the scenario. `Given` → arrange with factories; `When` → one request; `Then`/`And` → assertions, one per line of the scenario.
2. Name the test after it: `US-06 sc.3 approve when no spots left → 409 ROLE_FILLED, status stays PENDING`. The prefix is the traceability key; `/check-story` greps for it.
3. Assert the contract, not the implementation: status code, `error.code`, DTO fields present or **absent** (`not.toHaveProperty('leadTelegram')`), DB state after the call.
4. One scenario = one test. Shared setup goes to factories, not to a giant `beforeAll`.
5. Acceptance criteria that are not scenarios still get a test (e.g. "sorted by publishedAt DESC").

Example mapping:

| Scenario | Level | Test |
|---|---|---|
| US-01 sc.3 invalid username | unit (shared) | `telegramSchema` rejects `orest lead!` with the AC message |
| US-05 sc.3 non-owner reads applications | API | `GET /projects/:id/applications` as another user → 403 `FORBIDDEN` |
| US-06 sc.3 race on the last spot | API | two `approve` calls in `Promise.all` → one 200, one 409; DB has exactly one APPROVED |
| US-13 sc.2 empty state | component | `MyApplicationsPage` with `[]` shows "You have no applications yet" and the catalog link |
| Journey lead → student → lead | e2e | create, add role, publish, apply as a student, approve, see Telegram |

## Test database (API tests)

- `apps/api/vitest.config.ts` sets `DATABASE_URL=file:./test.db` for the workers and a global setup deletes the `test.db` file and runs a plain `prisma db push` on the empty file once, so the test DB always matches `schema.prisma` without any destructive flag.
- `tests/helpers/db.ts` → `resetDb()` deletes all rows in FK order; call it in `beforeEach`. Tests never depend on each other's data.
- Files run **serially** (`fileParallelism: false`): one SQLite file, no cross-file races. Tests inside a file may still use `Promise.all` to provoke a real race on purpose (US-06 sc.3).
- Factories (`tests/helpers/factories.ts`, to be added with the first story): `createUser()`, `createProject({ status })`, `createRole({ availableSpots })`, `createApplication()`. Each returns the Prisma record; defaults are valid; only pass what the scenario cares about.
- Auth in API tests: log in through the real endpoint once per test and reuse the cookie jar (`supertest.agent`). No bypass flags in production code.

## Race tests (ADR-0007)

```ts
const [a, b] = await Promise.all([
  agent.post(`/api/applications/${app1.id}/approve`),
  agent.post(`/api/applications/${app2.id}/approve`),
]);
expect([a.status, b.status].sort()).toEqual([200, 409]);
expect(await prisma.application.count({ where: { roleId, status: 'APPROVED' } })).toBe(1);
```

This is the only test that proves the conditional update works; a sequential test cannot. It is part of the definition of done for US-06 and US-12.

## End-to-end rules (Playwright)

- One spec per journey, not per story. Journeys: `smoke` (app and API are up), `lead-recruits` (create → publish → applications → approve), `student-applies` (catalog → filter → project → apply → my applications).
- Seed through the API (`request` fixture), not through the UI, unless the UI step is what the journey tests.
- Locate by role and accessible name (`getByRole('button', { name: 'Apply' })`), never by CSS class.
- Web-first assertions (`await expect(locator).toBeVisible()`); no `waitForTimeout`.
- E2E runs against `pnpm dev` servers started by the Playwright config; it needs `apps/api/.env` and a migrated `dev.db`. Browsers: `pnpm exec playwright install chromium` once.

## What we deliberately do not test

- Prisma, Express, React Router, zod themselves.
- Styles and layout.
- Every validation message through the browser: unit tests on the shared schemas cover the rules; one component test proves the message is rendered.

## Commands

```
pnpm test                      # unit + API + component (vitest, all packages)
pnpm --filter @devmatch/api test -- US-06   # one story's API tests
pnpm test:e2e                  # Playwright journeys (starts api + web)
```

## Definition of done (tests part)

Every AC and every scenario of the story has a test whose name starts with the story key. `/check-story US-xx` must report no `missing` rows. The race test exists for stories that touch `availableSpots`.
