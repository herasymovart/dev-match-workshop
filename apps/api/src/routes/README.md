# routes/

HTTP layer only. One file per resource (`auth.ts`, `me.ts`, `projects.ts`, `roles.ts`, `applications.ts`), mounted in `index.ts`.

A route handler does exactly four things:
1. `validateBody(schema)` from `middleware/validate.ts` with a schema from `@devmatch/shared`;
2. auth / owner check via middleware (`requireAuth`, `requireProjectOwner`);
3. call one function from `services/`;
4. return a DTO built in `serializers/`.

No business rules here. If you are writing an `if` about statuses or counters in a route, move it to a service.
Access rules and response codes per endpoint: `docs/architecture/api.md`.
