# Architecture Decision Records

Every decision that is hard to change or that affects everyone on the team is recorded as an ADR.

## When to write an ADR

**Write one for:** the choice of framework/DB/hosting; the API or error format; the authentication method; anything that changes the repository structure; decisions where the discussion lasted longer than 10 minutes.
**Do not write one for:** the choice of a variable name, a date-formatting library, the order of fields in a form. That is what code review is for.

## Template

```markdown
# ADR-NNNN: Title

**Status:** proposed | accepted | superseded by ADR-XXXX
**Date:** YYYY-MM-DD

## Context
What forces the decision. Team constraints, requirements (US-xx), previous decisions.

## Options
### A. …
+ pros / − cons — for this team, not in general
### B. …

## Decision
What was chosen and why specifically for us.

## Consequences
What becomes easier; what becomes harder; what we postpone; when to revisit.

## Related stories
US-xx, US-yy
```

Comparison of options before the decisions — `docs/analysis/options.md`.

## Index

| # | Decision | Status |
|---|---|---|
| [0001](0001-web-not-mobile.md) | Web application (React), not React Native | accepted |
| [0002](0002-repo-structure.md) | Monorepo on pnpm workspaces: apps/web, apps/api, packages/shared | accepted |
| [0003](0003-frontend-stack.md) | Vite + React + TypeScript, React Router, TanStack Query, CSS Modules | accepted |
| [0004](0004-backend-stack.md) | Node 20 + Express 5 + TypeScript, zod validation, REST/JSON, single error format | accepted |
| [0005](0005-data-store.md) | Prisma ORM; SQLite for development and the MVP, PostgreSQL as the migration path | accepted |
| [0006](0006-auth.md) | Email + password, cookie sessions; OAuth — post-MVP | accepted |
| [0007](0007-concurrency.md) | Spot counter invariants — conditional UPDATE in a transaction, 409 on conflict | accepted |
| [0008](0008-deployment.md) | One Node process serves the API and static files; free PaaS | accepted |
| [0009](0009-architecture-style.md) | Layered monolith (routes → services → data); frontend — pages + hooks + server-state | accepted |
