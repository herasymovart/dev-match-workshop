# Workshop materials — how to use this repository

**Workshop:** "From requirements to a technical solution: architecture and design with AI support"
**Date:** 22 October 2026 (Thu), 13:30–14:50, online · NaUKMA, AI orchestration course

The repository is a linear git history with tags `step-00` … `step-06`. Each tag = the state of the project *after* the corresponding prompt. The prompts are in `workshop/prompts/`, the presenter script is in `workshop/RUNBOOK.md` (English, compact) and `workshop/SCRIPT.uk.md` (Ukrainian, full spoken text, includes the opening discussion with the students), the breakout rooms task is in `workshop/breakout.md`, and `workshop/PROMPTS.md` is the hand-out for students: all six prompts in one file with instructions for running them on their own project. The `workshop/` folder is identical on all tags.

## Switching between steps

```bash
./workshop/go.sh list        # all steps with descriptions
./workshop/go.sh 3           # go to step-03 (detached HEAD, read-only)
./workshop/go.sh diff 2 3    # what exactly step 3 added
./workshop/go.sh script 3    # the presenter script for step 3 (SCRIPT.uk.md); go.sh N prints this hint after switching
./workshop/go.sh 1 live      # branch live/step-01 from the step-01 tag — a sandbox to run Claude for real
./workshop/go.sh keep        # after a live demo: commit what Claude wrote on the live branch
./workshop/go.sh discard     # ...or throw it away; the switcher refuses to move while changes are uncommitted
git switch main              # return to the end (= step-06)
```

A live branch is the state *after* step N, so `live/step-01` is where you run prompt 2 live: the requirements and the digest are there, `options.md` and the ADRs are not yet. Start Claude with `claude --permission-mode plan` to open directly in plan mode. The full on-stage procedure is in the runbook, step 2.

| Tag | What appeared | Prompt |
|---|---|---|
| `step-00` | only `docs/` (input requirements) + `workshop/` | — |
| `step-01` | `CLAUDE.md` v1, `.claude/settings.json`, `docs/analysis/requirements-digest.md` | `01-analysis.md` |
| `step-02` | `docs/analysis/options.md` — map of decisions and options (done in **plan mode**; the saved plan is `workshop/plans/02-plan.md`), `docs/adr/0001…0009` + README with the template, `docs/architecture/risks, integrations` | `02-decisions.md` |
| `step-03` | `docs/architecture/overview, domain-model, api, data-model` + `system.html` (visual map) + `traceability` (the check against the stories) | `03-architecture.md` |
| `step-04` | `CLAUDE.md` v2, `.claude/skills/*`, `.claude/agents/*`, `.claude/rules/*`, hook `protect-input-docs`, settings v2 | `04-claude-setup.md` |
| `step-05` | pnpm monorepo: `apps/web`, `apps/api`, `packages/shared`, migration, schema tests | `05-scaffold.md` |
| `step-06` | `docs/architecture/testing.md`, test infrastructure (vitest + supertest + test DB, jsdom, Playwright), first tests for the skeleton, skills `/unit-tests` and `/e2e-tests` | `06-testing.md` |

## Preparation the day before (15 min)

1. `git switch main && pnpm install` — in pnpm 12 the permissions for build scripts are already in `pnpm-workspace.yaml` (`allowBuilds`); if pnpm asks — `pnpm approve-builds --all`.
2. `cp apps/api/.env.example apps/api/.env && pnpm db:migrate` — creates `apps/api/prisma/dev.db`.
3. `pnpm typecheck && pnpm test` — must be green (24 tests across shared, api and web).
   Then `pnpm exec playwright install chromium` (once) and `pnpm test:e2e` — the smoke journey must pass; it starts both dev servers itself.
4. `pnpm dev` → open http://localhost:5173 — the catalog should show "API: ok". Stop it.
5. Open the IDE on `docs/`, a terminal with a large font, `claude` logged in. Check that `claude` starts in the repo and sees `CLAUDE.md` (on `main`).
6. For the plan mode demo (step 2): `./workshop/go.sh 1 live` creates the sandbox branch `live/step-01`. On it, start `claude --permission-mode plan`, check the status bar says "plan mode on" and that Claude sees `CLAUDE.md`, then `/exit`. Leave the branch in place; on the day, `git switch live/step-01` brings you back to it. If you skip the live run, show `workshop/plans/02-plan.md` (the plan) and the result on `step-02` instead.
7. `open docs/architecture/system.html` — press `3`, then Play. Keep that browser tab for step 3; the ☾/☀ button switches the theme (dark on a dark terminal looks best on a projector).
8. Hook check for step 4: on `main`, start `claude`, type `add the sentence "test" to docs/US-INIT-1.md`, and confirm the edit is blocked with the message from `.claude/hooks/protect-input-docs.mjs`. `/exit`. Optional: `claude -w demo` once, to see the worktree prompt; answer "remove" on exit.

After the workshop: `node_modules/`, `apps/api/.env`, `dev.db` are in `.gitignore`; they don't touch the tags.

## What to show on screen

- Two windows: IDE (result files) and terminal (`claude` or `go.sh`). Don't switch between browser tabs.
- Each step: **prompt** (from `workshop/prompts/NN-*.md`, the ```text block) → briefly *why it is phrased this way* → `go.sh N` → **2–3 result files** → "what to pay attention to" from the same prompt file.
- Don't read documents aloud. Show the structure and 1–2 places where the AI found something that wasn't in the requirements.
