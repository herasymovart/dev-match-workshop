#!/usr/bin/env bash
# Rebuilds the linear step-00..step-06 history from the current working tree (must be clean, on main).
# Files that differ between steps are kept in workshop/snapshots/<step>/ and copied in at that step;
# the final step restores the full current tree. Tags are recreated; old commits become unreachable.
set -euo pipefail
cd "$(dirname "$0")/.."
[ "$(git branch --show-current)" = "main" ] || { echo "run this on branch main (now on: $(git branch --show-current))"; exit 1; }
[ -z "$(git status --short)" ] || { echo "working tree must be clean (commit everything on main first)"; exit 1; }
for f in docs/analysis/options.md docs/adr/0009-architecture-style.md docs/architecture/risks.md docs/architecture/system.html docs/architecture/traceability.md .claude/rules/api.md .claude/hooks/protect-input-docs.mjs docs/architecture/testing.md e2e/smoke.spec.ts apps/api/tests/app.test.ts; do
  [ -f "$f" ] || { echo "main is incomplete: $f missing — refusing to rebuild"; exit 1; }
done
trap 'echo; echo "REBUILD FAILED. Recover with: git switch -f main && git branch -D rebuild; then fix and rerun. Tags are recreated by the script."' ERR
FINAL=$(git rev-parse HEAD)
SNAP=workshop/snapshots
git tag -l 'step-*' | xargs -r git tag -d >/dev/null
git checkout -q --orphan rebuild
git rm -r -q --cached .
c() { git commit -q -m "$1" -m "$2" -m "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"; }
restore() { git checkout -q "$FINAL" -- "$@"; }

cp "$SNAP/step-01/CLAUDE.md" CLAUDE.md && cp "$SNAP/step-01/settings.json" .claude/settings.json
git add .gitignore docs/project_context.md docs/US-INIT-1.md docs/US-STUD-1.md workshop
c "step-00: input requirements and workshop materials" "Teacher's DevMatch docs (Ukrainian input) plus workshop prompts (01–06), captured plan-mode plan, runbook, breakout task, go.sh switcher and this rebuild script."
git tag -a step-00 -m "Start: only docs/ and workshop/"

git add CLAUDE.md .claude/settings.json docs/analysis/requirements-digest.md
c "step-01: environment setup and requirements analysis" "CLAUDE.md v1, read-only permissions, docs/analysis/requirements-digest.md (prompt 01)."
git tag -a step-01 -m "After prompt 01: requirements digest with open questions"

git add docs/analysis/options.md docs/adr docs/architecture/risks.md docs/architecture/integrations.md
c "step-02: decisions — options map (plan mode), ADRs, risks" "docs/analysis/options.md compared against team constraints K1–K8; ADR-0001..0009 recording the choices with alternatives and consequences; risk register with triggers and external dependencies. Produced in one plan-mode session; the approved plan is workshop/plans/02-plan.md (prompt 02)."
git tag -a step-02 -m "After prompt 02: options analysis (plan mode), ADRs, risks and integrations"

git add docs/architecture/overview.md docs/architecture/domain-model.md docs/architecture/api.md docs/architecture/data-model.md docs/architecture/system.html docs/architecture/traceability.md
c "step-03: architecture sketch and traceability" "C4 overview, domain model with state machines, API contract, data model, system.html — the self-contained visual map of the same — and the US → endpoint → page → tests matrix that surfaces the US-08/US-09 contradiction (prompt 03)."
git tag -a step-03 -m "After prompt 03: architecture sketch, visual map and traceability"

cp "$SNAP/step-04/CLAUDE.md" CLAUDE.md && cp "$SNAP/step-04/settings.json" .claude/settings.json
git add CLAUDE.md .claude/settings.json .claude/skills/implement-story .claude/skills/adr .claude/skills/check-story .claude/agents .claude/rules .claude/hooks
c "step-04: Claude Code setup for the team" "CLAUDE.md v2 with documentation map and rules from ADRs; skills implement-story, adr, check-story; architecture-reviewer agent; path-scoped rules; hook protecting the input docs; pnpm permissions (prompt 04)."
git tag -a step-04 -m "After prompt 04: Claude Code team setup"

# step-05: skeleton without the step-06 test infrastructure (snapshots hold the pre-test versions)
for f in $(cd "$SNAP/step-05" && find . -type f | sed 's#^\./##'); do mkdir -p "$(dirname "$f")"; cp "$SNAP/step-05/$f" "$f"; done
git add -A
git reset -q -- docs/architecture/testing.md .claude/skills/unit-tests .claude/skills/e2e-tests e2e apps/api/tests apps/api/vitest.config.ts apps/web/src/__tests__
c "step-05: monorepo skeleton" "pnpm workspaces: apps/web (Vite React), apps/api (Express 5 + Prisma/SQLite, initial migration), packages/shared (zod schemas + 13 Gherkin-named tests). No business logic (prompt 05)."
git tag -a step-05 -m "After prompt 05: runnable skeleton"

restore . && git add -A
c "step-06: testing technique and first tests" "docs/architecture/testing.md; vitest + supertest + SQLite test DB for the API, jsdom + Testing Library for web, Playwright smoke journey; tests for the existing skeleton; skills unit-tests and e2e-tests; CLAUDE.md v3 (prompt 06)."
git tag -a step-06 -m "After prompt 06: testing strategy, infrastructure and first tests"

git branch -D main -q && git branch -m main
git log --oneline --decorate
