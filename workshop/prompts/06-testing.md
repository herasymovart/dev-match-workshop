# Step 6 — Testing technique and the first tests

**Goal:** turn the Gherkin scenarios into a *technique* the team applies to every story, and prove it on the code that already exists (the skeleton), so the second workshop starts with a working test setup, not with "we should add tests later".
**Why now:** the skeleton has validation, an error handler, a schema and pages. If they are not tested now, the first story will be built on untested ground. And a test name like `US-06 sc.3 …` is the cheapest traceability there is.

**What to show the students in the prompt:**
- we ask for a *strategy document* first, then infrastructure, then tests — same order as for the architecture: decide, then build;
- "one scenario = one test, named after the scenario" — this one rule makes `/check-story` possible;
- the race test is called out explicitly, because it is the only test that proves ADR-0007;
- the prompt demands that the tests run green before reporting. "Tests written" is not the same as "tests pass".

---

```text
Read docs/architecture/ (especially api.md, domain-model.md, traceability.md),
docs/adr/0007-concurrency.md, CLAUDE.md and the current code in apps/ and packages/.

1. Write docs/architecture/testing.md — the testing strategy for THIS project:
   the test pyramid with the share of tests per level and why; the technique
   for turning a Gherkin scenario into a test (naming convention "US-xx sc.N …",
   one scenario = one test, assert the contract not the implementation);
   how API tests get a real database (SQLite test DB, reset per test, serial
   files); how the race condition from ADR-0007 is tested; rules for e2e
   (one spec per journey, seed via API, locate by role, no sleeps); what we
   deliberately do not test; commands; the tests part of definition of done.

2. Set up the infrastructure: vitest + supertest for apps/api with a test
   database and a resetDb() helper; vitest + jsdom + Testing Library for
   apps/web; Playwright at the repo root with a config that starts both dev
   servers. Add pnpm scripts (test, test:e2e) and gitignore entries.

3. Write tests for the code that already exists, following the strategy:
   - apps/api: health endpoint; 404 in the documented error format; malformed
     JSON → 400 VALIDATION_ERROR; validateBody middleware (details per field,
     body replaced by the parsed value); the Prisma schema's unique constraints
     (User.email, Role projectId+name) against the real test DB.
   - apps/web: the NotFound page and the page stub render what the router
     promises (title, story references, catalog link).
   - e2e: one smoke journey — open /, see the navigation, see "API: ok".
   Name tests after the scenario or acceptance criterion they come from; for
   infrastructure tests, name them after the document section they protect.

4. Create two skills: /unit-tests US-xx (unit + API tests from the story's
   scenarios, using the helpers, one test per scenario, reports a coverage
   table) and /e2e-tests <journey> (Playwright spec for a journey across
   several stories, seeds via API). Update CLAUDE.md (commands, documentation
   map, skills) and settings permissions.

Run pnpm typecheck, pnpm test and pnpm test:e2e and fix whatever fails before
reporting. Report what was created and what each command verified.
```

---

**After the result, point at:**
- `docs/architecture/testing.md` → the "From Gherkin to a test" section and the example mapping table. 🎤 This is the technique; everything else is tooling.
- `apps/api/tests/app.test.ts` → test names reference `api.md` sections; `tests/db.test.ts` proves the unique constraints that `data-model.md` promises.
- `apps/api/vitest.config.ts` + `tests/global-setup.ts` → the test DB is rebuilt from the schema every run; `resetDb()` in `beforeEach`. 🎤 No shared fixtures, no order dependence.
- `e2e/smoke.spec.ts` → 17 lines, starts both servers from config. 🎤 E2E is for journeys, not for validation messages.
- `.claude/skills/unit-tests/SKILL.md` → the plan step lists the scenarios *before* writing tests, and the report is a coverage table. 🎤 On workshop 2, the loop is `/implement-story` → `/unit-tests` → `/check-story`.
- Technique to try live if time allows: "List every Gherkin scenario in US-06 and write the test name for each, do not write the test yet." Names first, code second.
