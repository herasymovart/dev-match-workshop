# services/

Business rules and transactions. Planned modules (docs/architecture/overview.md → API components):

- `auth.ts` — register, login (bcrypt), sessions (ADR-0006)
- `projects.ts` — create (DRAFT), addRole (unique name, status check), publish (≥ 1 role), close
- `catalog.ts` — public list and details; tag filter; hides DRAFT and owner contacts
- `applications.ts` — create / approve / reject. **The only place that changes `Role.availableSpots`**, always inside `prisma.$transaction` with a conditional `updateMany` and a `count` check (ADR-0007)

Services throw `ApiError` from `lib/errors.ts` with codes from `docs/architecture/api.md`. They receive plain inputs (already validated) and return Prisma records; serializers turn those into DTOs.
