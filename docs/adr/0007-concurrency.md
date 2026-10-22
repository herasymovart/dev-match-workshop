# ADR-0007: Spot counter invariants — conditional UPDATE in a transaction, 409 on conflict

**Status:** accepted
**Date:** 2026-10-22

## Context
US-06 sc.3: two approvals for the last spot a second apart — the second must be rejected. US-12 sc.4: applying for a role that has just been filled → 409. Invariants: `0 ≤ available_spots ≤ total_spots`; `available_spots == 0 ⇔ status == FILLED`; one active application per (user, role) (R11).

## Options
### A. Check in code: read the role → if `available_spots > 0` → update
− a classic race: two requests read 1, both write 0 and both approve. Exactly what US-06 sc.3 forbids.

### B. Transaction + conditional UPDATE (`WHERE available_spots > 0`) + check `count == 1`
+ atomic on any DB that has transactions (SQLite, PostgreSQL)
+ one `approveApplication` function in `services/`, easy to test with two parallel calls
− requires discipline: all counter changes go only through this service

### C. Serialization via row locking (`SELECT … FOR UPDATE`)
+ an understandable model
− not available on SQLite; postponed until a possible migration to PostgreSQL

## Decision
**B.** In `services/applications.ts`:
```
transaction:
  app = find application; if status != PENDING → 409 ALREADY_DECIDED
  updated = UPDATE role SET available_spots = available_spots - 1
            WHERE id = app.roleId AND available_spots > 0
  if updated == 0 → 409 ROLE_FILLED
  if role.available_spots == 0 → UPDATE role SET status = FILLED
  UPDATE application SET status = APPROVED, decided_at = now()
```
Similarly for `createApplication`: in a transaction, check that the project is `PUBLISHED` (otherwise 400 PROJECT_CLOSED), the role is `OPEN` and `available_spots > 0` (otherwise 409 ROLE_FILLED), there is no active application (otherwise 409 DUPLICATE_APPLICATION), then INSERT.

## Consequences
+ the invariant is guaranteed by the DB, not by "carefulness"
+ a race test is mandatory in the definition of done for US-06 and US-12
− Prisma: the conditional UPDATE is done via `updateMany` with `where`, and we check `count`

## Related stories
US-03, US-06, US-07, US-12
