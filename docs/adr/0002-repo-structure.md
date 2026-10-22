# ADR-0002: Monorepo on pnpm workspaces

**Status:** accepted
**Date:** 2026-10-22

## Context
Frontend and backend are both in TypeScript. Validation rules (US-01, US-02, US-03, US-12) must be identical in the form and in the API (digest §3). Team of 3–4 people, one repository on GitHub, Claude Code must see the whole context.

## Options
### A. Monorepo: apps/web, apps/api, packages/shared (pnpm workspaces)
+ shared validation schemas and types are imported by both sides — a single source of truth
+ one `git clone`, one `pnpm dev` command, one PR per story (frontend + backend together)
+ Claude Code sees both sides of the contract
− workspaces and tsconfig paths have to be set up once

### B. Two repositories
+ simpler structure of each
− duplicated validations → divergence between the form and the API (exactly what the requirements do not allow)
− a story = two PRs in two repos, harder review

### C. One package, frontend and backend in a single src/ folder
+ no setup at all
− mixed dependencies (React in the server bundle), impossible to deploy separately, hard to scale the team

## Decision
**A.** Structure:
```
apps/web        — React SPA
apps/api        — Express API
packages/shared — zod schemas, status enums, DTO types
docs/           — requirements, ADRs, architecture
```
Without Turborepo/Nx: three packages do not need an orchestrator; `pnpm -r` is enough.

## Consequences
+ the API contract lives in code (`packages/shared`) and in a document (`docs/architecture/api.md`) — on divergence, the document is primary
− a change in shared requires restarting both apps in dev (acceptable)

## Related stories
US-01, US-02, US-03, US-12 (shared validations)
