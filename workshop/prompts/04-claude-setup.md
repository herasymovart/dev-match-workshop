# Step 4 — Claude Code setup for the team

**Goal:** make sure that *every* team member (and the AI in their terminal) works by the same rules and sees the same architecture.
**Key idea:** the documents from steps 1–3 are the AI's "memory" of the project. CLAUDE.md doesn't duplicate them, it *points* to them and says when to read what. Skills are the team's repeatable workflows, written down once. Rules, hooks and permissions are the guard-rails that work even when nobody reads CLAUDE.md. Worktrees and forks let four people (or one person with four ideas) work in parallel without stepping on each other.

**What to show students:**
- CLAUDE.md is read at the start of every session — which is why it is short and references docs/;
- the `/implement-story US-05` skill — the standard way to pick up a story;
- the architecture reviewer agent — a second pair of eyes that checks code against the ADRs, not against taste;
- settings.json — permissions, so you don't have to confirm every `pnpm test`; and a hook that *blocks* edits to the input docs instead of asking nicely;
- `.claude/rules/api.md` — conventions that load only when a file in `apps/api/` is touched, so CLAUDE.md stays short;
- the feature tour (runbook, step 4): worktrees, forks, checkpoints, memory, MCP, headless mode — what exists and when a team should switch it on.

---

```text
Set up this repository for a team of 3–4 developers working with Claude Code.
The code structure will be as described in docs/adr/0002-repo-structure.md
(pnpm monorepo: apps/web, apps/api, packages/shared).

1. Update CLAUDE.md: the project's purpose in one paragraph; the stack and commands
   (dev/typecheck/test); a documentation map — what to read before which type of
   task (new story → traceability + api + domain-model; schema change →
   data-model + ADR); code rules that follow from the ADRs (error format,
   validation via shared schemas, transactions for counters); definition of
   done for a story. Don't copy the contents of docs/ into CLAUDE.md — reference them.

2. Create skills in .claude/skills/<name>/SKILL.md:
   - implement-story: takes a story number (US-xx), reads it from docs/,
     finds the row in traceability.md, proposes a plan (endpoint, page,
     schema, tests from Gherkin), waits for approval, then implements and updates
     traceability.
   - adr: creates a new ADR from the template in docs/adr/README.md with the next
     number, requires at least 2 alternatives.
   - check-story: checks whether the story's implementation covers every AC and every
     Gherkin scenario; the result is a covered/not covered table with references
     to code and tests.

3. Create the agent .claude/agents/architecture-reviewer.md: read-only, checks the
   diff against docs/adr/ and docs/architecture/, reports deviations with a
   reference to the specific ADR/section, doesn't comment on style.

4. Create .claude/settings.json with permissions for pnpm commands (install, dev,
   typecheck, test, lint, prisma generate/migrate) and read-only git commands.

5. Create .claude/rules/ with path-scoped conventions that load only when a file in
   that folder is touched: api.md (paths apps/api/**: feature = route + service +
   serializer, ApiError usage, the ADR-0007 transaction pattern verbatim, test rules),
   web.md (paths apps/web/**: pages / queries / api client, forms with shared schemas,
   accessible markup so Playwright can locate by role), input-docs.md
   (docs/project_context.md and docs/US-*.md are read-only input; problems go to
   "Open questions").

6. Add a PreToolUse hook for Edit|Write in .claude/settings.json that blocks changes
   to the input documents: a small Node script in .claude/hooks/ with no
   dependencies, exit code 2 and a one-sentence explanation on stderr.

7. Add .claude/worktrees/ and CLAUDE.local.md to .gitignore, so each developer can
   run one story per worktree (claude -w us-06) and keep personal notes out of git.
   Mention both, in one line each, in the "Working with Claude" section of CLAUDE.md.

Write the skills and CLAUDE.md in English (the tool's convention), concisely.
```

---

**After the result, pay attention to:**
- CLAUDE.md about 70 lines. If it grows — something needs to be moved out to docs/, a rule or a skill.
- Ask Claude to "add a sentence to docs/US-INIT-1.md": the hook refuses and explains why. A rule in CLAUDE.md is advice; a hook is enforcement.
- A skill is not magic, it is a markdown instruction. Open implement-story and read it aloud.
- For the second workshop: it is precisely via `/implement-story` that the team will pick up stories.
