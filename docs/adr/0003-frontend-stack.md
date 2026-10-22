# ADR-0003: Frontend — Vite + React + TypeScript, React Router, TanStack Query, CSS Modules

**Status:** accepted
**Date:** 2026-10-22

## Context
An SPA with ~8 pages (catalog, project, sign-in, onboarding, my projects, manage project, my applications, new project). The data is lists and forms; real-time is not needed (digest §3). The team knows React at a basic level.

## Options
### A. Vite + React Router + TanStack Query + CSS Modules
+ Vite: starts in seconds, zero configuration for TS
+ React Router: the standard, enough for 8 pages
+ TanStack Query: cache, loading/error states, invalidation after mutations (approved an application → the list updated) without manual state management
+ CSS Modules are built into Vite — zero dependencies at the start
− TanStack Query is one more concept to learn (pays off on US-05/06/07)

### B. Next.js
+ SSR, file-based routing
− SSR is not needed (the public catalog does not require SEO in the MVP); App Router + server components are unnecessary complexity for the team; harder to host for free together with a separate API

### C. Vite + React + useState/useEffect for data, without a library
+ less to learn
− manual cache and synchronization of lists after mutations — a classic source of bugs in student projects

## Decision
**A.** Tailwind or a UI kit can be added later as a separate decision if the team wants; it does not affect the architecture.

## Consequences
+ a standard, well-documented stack; Claude Code generates it confidently
− no SSR; if SEO for the catalog becomes necessary — a separate ADR

## Related stories
US-05, US-06, US-07, US-09, US-10, US-13
