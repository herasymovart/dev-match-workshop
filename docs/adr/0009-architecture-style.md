# ADR-0009: Architecture style — layered monolith; frontend — pages + hooks + server-state

**Status:** accepted
**Date:** 2026-10-22

## Context
We need to agree on *where in the code the business rules live* (R1–R18 from the digest) and how 4 people work in parallel without getting in each other's way. Comparison of options — `docs/analysis/options.md` §1.

## Options
### A. Layered structure (routes → services → data) in one process
+ one place for every rule: `services/*`; the HTTP layer is thin
+ a service is tested without HTTP; transactions (ADR-0007) are encapsulated
+ a minimum of concepts for a team with basic experience
− discipline: a rule in a route is a violation that review catches

### B. Clean / Hexagonal (domain, use cases, ports & adapters)
+ independence from the DB and the transport, maximum testability
− interfaces and adapters for a DB we do not plan to change; twice as many files per story; a learning curve for the team

### C. Everything in route handlers
+ the fastest start
− rules R7/R8/R11 get smeared across handlers; testing only through HTTP; a month later nobody knows where the counter changes

### D. Modular monolith (feature modules)
+ isolation by feature
− for 4 entities and 14 endpoints the module boundaries are artificial; the advantage appears at 6+ modules

Frontend: **pages + hooks + TanStack Query** (server state) vs a global store (MVVM/Redux) vs `useEffect`+`fetch`. The domain is CRUD over server data; there is almost no local state; a store would duplicate the server.

## Decision
**A** for the backend, **pages + hooks + server-state** for the frontend.

```
apps/api/src
  routes/        HTTP: validation (shared), auth middleware, service call, DTO
  services/      business rules, transactions; the single place where counters change
  serializers/   Prisma record → DTO depending on who is asking
  middleware/    auth, validate, error
  lib/           prisma, errors
apps/web/src
  pages/         one page = one route; composition of components
  queries/       hooks over TanStack Query: keys, invalidation
  api/           fetch client, ApiError
  components/    presentational components without requests
```

Rules: a route contains no `if` about statuses/counters; a component does not call `fetch` directly; server data is not copied into local state.

## Consequences
+ a new member knows where to look: rule → `services`, response → `serializers`, screen → `pages`
+ `architecture-reviewer` checks these rules mechanically
− if the domain grows (moderation, courses, mentors) — revisit in favor of D; migrating A → D is moving files, not rewriting

## Related stories
all; especially US-06, US-12 (rules in services)
