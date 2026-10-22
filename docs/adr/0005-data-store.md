# ADR-0005: Prisma ORM; SQLite for development and the MVP, PostgreSQL as the migration path

**Status:** accepted
**Date:** 2026-10-22

## Context
4 tables, relational links, transactions with a conditional update (ADR-0007). Constraints: local run with one command after clone, zero budget, no DevOps. Load — hundreds of users (digest A4).

## Options
### A. Prisma + SQLite (a file in the repo folder, in .gitignore)
+ zero infrastructure: `pnpm install && pnpm db:migrate` — and it works; every developer has their own DB
+ Prisma: schema = documentation, migrations, typed client; transactions are supported
− Prisma does not support `enum` on SQLite → statuses are stored as strings and checked with zod in code
− one file = one process; horizontal scaling is impossible (not needed, A4)

### B. Prisma + PostgreSQL (Docker locally, Neon/Supabase free tier in prod)
+ a "real" DB, enum, partial unique index for R11
− Docker for everyone on the team + an external service with keys from day one; more points of failure at the start
− the free tier "goes to sleep", which is confusing during a demo

### C. Drizzle + SQLite
+ lighter than Prisma, closer to SQL
− less material for students; Claude Code generates Prisma more reliably

## Decision
**A** for development and the MVP. Prisma allows switching to PostgreSQL by changing the `provider` + one migration; we record this as the **planned path** if a trigger from `risks.md` fires (several instances or >1 parallel deployment).

## Consequences
+ onboarding a new member — minutes
− statuses as strings (`packages/shared` is the single source of allowed values); the uniqueness "one active application per role" (R11) cannot be expressed by the schema on SQLite → checked in a transaction (ADR-0007)
− backup in prod = a copy of the file; acceptable for a student project, recorded in the risks

## Related stories
US-06, US-12 (transactions), US-09/US-10 (catalog queries)
