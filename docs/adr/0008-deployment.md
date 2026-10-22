# ADR-0008: One Node process serves the API and static files; free PaaS

**Status:** accepted
**Date:** 2026-10-22

## Context
Zero budget, no DevOps. A public link is needed for the demo and for sharing in chats (US-04). Cookie sessions (ADR-0006) are simplest when the SPA and the API are on one origin.

## Options
### A. One process: Express serves `apps/web/dist` as static files + `/api/*`
+ one deployment, one domain, no CORS and no cookie problems
+ the same topology locally and in prod
− static files through Node, no CDN — irrelevant for hundreds of users

### B. Frontend on Vercel/Netlify, API on Render/Railway
+ CDN for static files
− two deployments, CORS, cookies across domains (SameSite=None + Secure), two sets of environment variables that get mixed up

### C. Docker Compose on a VPS
+ full control
− no free VPS and no DevOps experience

## Decision
**A.** Hosting — Render or Railway (free tier) with a persistent disk for the SQLite file. `pnpm build` builds web → `apps/web/dist`; `pnpm start` launches the api, which serves dist and `/api`.

## Consequences
+ a demo link in one evening
− the free tier "goes to sleep" after idle — the first request takes 20–40 s; "wake it up" in advance before a demo (recorded in risks.md)
− persistent disk → one instance (consistent with ADR-0005)

## Related stories
US-04 (public link), all
