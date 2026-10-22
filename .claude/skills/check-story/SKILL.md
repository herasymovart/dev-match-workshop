---
name: check-story
description: Verify that a DevMatch user story (US-01..US-14) is fully implemented - maps every acceptance criterion and Gherkin scenario to code and tests, and reports a covered / not-covered table. Use before marking a story done or when reviewing a PR that claims to implement a story.
argument-hint: US-xx
---

Check coverage of user story `$ARGUMENTS`. Read-only: do not modify code.

1. Read the story from `docs/US-INIT-1.md` or `docs/US-STUD-1.md`: every acceptance-criteria checkbox and every Gherkin scenario.
2. Read its row in `docs/architecture/traceability.md` and the contract in `docs/architecture/api.md`.
3. For each AC item and each scenario, find:
   - the code that implements it (file:line in `apps/api/src/services`, `routes`, `apps/web/src`), and
   - the test that proves it (file and test name).
   Run the relevant tests (`pnpm --filter @devmatch/api test -- <pattern>` or `pnpm test`) and record the result.
4. Report a table:

   | Item | Source | Implementation | Test | Status |
   |---|---|---|---|---|
   | AC 2 | US-06 | services/applications.ts:41 | US-06 sc.1 | covered |
   | sc.3 race | US-06 | — | — | **missing** |

   Status is one of: covered / partial (say what is missing) / missing / contradicts docs (quote the doc).
5. Check the cross-cutting rules: server-side owner check present; error codes match api.md; no `passwordHash` or lead Telegram leaks; validation uses `packages/shared`.
6. Finish with: the list of gaps, ordered by severity, and whether the story can be marked done. Do not fix anything; suggest the next command (`/implement-story` or specific edits).
