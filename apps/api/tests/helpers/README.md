# tests/helpers/

- `db.ts` — `resetDb()` and the shared Prisma client for assertions on DB state.
- `factories.ts` — TODO with the first story: `createUser()`, `createProject({ status })`, `createRole({ availableSpots })`, `createApplication()`. Defaults valid; pass only what the scenario cares about.
- `auth.ts` — TODO with auth: `loginAs(user)` returning a `supertest.agent` with the session cookie.

Conventions: `docs/architecture/testing.md`.
