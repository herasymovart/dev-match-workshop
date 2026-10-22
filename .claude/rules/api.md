---
paths:
  - "apps/api/**"
---

# apps/api conventions

Loaded only when a file under `apps/api/` is read or edited. General rules are in `CLAUDE.md`.

- One feature = three files: `src/routes/<feature>.ts` (HTTP only), `src/services/<feature>.ts`
  (rules, transactions), `src/serializers/<feature>.ts` (DTOs). Routes never import `prisma`.
- Throw `new ApiError(status, code, message, details?)` from `src/lib/errors.ts`; never `res.status(...).json(...)`
  an error by hand. `code` must exist in `docs/architecture/api.md`.
- The ADR-0007 pattern for spot counters, verbatim:

  ```ts
  await prisma.$transaction(async (tx) => {
    const { count } = await tx.role.updateMany({
      where: { id: roleId, availableSpots: { gt: 0 } },
      data: { availableSpots: { decrement: 1 } },
    });
    if (count === 0) throw new ApiError(409, "ROLE_FILLED", MESSAGES.roleFilled);
    // ...update the application, set role FILLED when the counter reaches 0
  });
  ```

- Owner check: load the entity, compare `ownerId` with `req.user.id`, throw 403 `FORBIDDEN`. Do this in the service, not the route.
- Tests live in `apps/api/tests/`, hit the app through `supertest`, use the real SQLite test DB (`resetDb()` in `beforeEach`). No mocks of Prisma or services.
