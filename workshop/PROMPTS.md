# DevMatch workshop — the prompts

Six prompts that take a project from requirements to a tested skeleton with Claude Code. This file is the prompts only; the reasoning behind each one is in `workshop/prompts/0N-*.md`, and the results for DevMatch are on the git tags `step-01` … `step-06` (`./workshop/go.sh N`).

## How to run them on your own project

1. Put your requirements in `docs/` (context, personas, user stories with acceptance criteria and, ideally, Gherkin scenarios). Everything else is derived from that folder.
2. Create a short `CLAUDE.md`: what the project is, where the requirements live, the constraints you already know, and the rule *"do not invent requirements silently; if something is missing, say so and propose an assumption"*. The DevMatch version at `step-01` is 23 lines.
3. Replace the **constraints block** in prompt 2 (team size, deadline, allowed stack, budget, how the code will be worked on). That block is what makes the AI rate options for *your* team instead of "industry standard".
4. Run the prompts in order, each in a fresh session, in the mode named next to it. Each prompt names the files it must produce; commit them before the next prompt.
5. After each result: verify it against the requirements and fix what is wrong before moving on. The thread through all six: **context → constraints → ask → verify → fix**.

The prompts reference DevMatch story numbers (US-01 … US-14, US-06 sc.3 and so on) and file names from the DevMatch results (`options.md`, ADR numbers). Change those references to your own stories; leave the structure of each prompt as it is.

---

## Step 1 — Requirements analysis

**Mode:** normal mode.

```text
Read all files in docs/ — these are the input requirements of the DevMatch project
(context, personas, user journey, 14 user stories with acceptance criteria and
Gherkin scenarios).

Do a requirements analysis for the subsequent design. Don't design anything and
don't choose technologies — analysis only. Write the result to
docs/analysis/requirements-digest.md in English, in the following structure:

1. Entities and their states. For each entity — the attributes explicitly mentioned
   in the requirements, and the states with transitions (who initiates the
   transition, under which condition).
2. Business rules / invariants extracted from the acceptance criteria and Gherkin.
   Each rule — with a reference to the story (US-xx) and the scenario.
3. Non-functional requirements that follow from the text (security, concurrency,
   access without authentication, etc.), even if they are not stated explicitly.
4. Gaps and open questions: what the requirements lack, but without which the
   system cannot be designed. For each — why it blocks and which answer is the
   cheapest for the MVP.
5. Assumptions you propose to adopt for the MVP, with a risk rating
   (low / medium / high) if the assumption turns out to be wrong.

Be specific: cite story and scenario numbers, don't paraphrase the requirements
in your own words where you can quote them.
```

---

## Step 2 — Decisions: map of options, ADRs, risks

**Mode:** plan mode (`claude --permission-mode plan`, or Shift+Tab until the status bar says "plan mode on"); approve the plan when it appears.

```text
Read docs/analysis/requirements-digest.md and docs/project_context.md.

We are at the design stage. Team context and constraints (this matters more
than "best practices"):
- team: 3–4 students, basic TypeScript / React / Node.js, no DevOps experience;
- deadline: 6–8 weeks until the demo, in parallel with other courses;
- allowed stack: only TypeScript, React or React Native, Node.js. No other languages;
- infrastructure budget: 0 UAH (free tiers); local launch with one command after git clone;
- the code will be worked on with Claude Code, so a predictable structure matters.

First the plan — don't choose anything yet. Which technical decisions must be
made before the code starts, in which order (what depends on what), and which
options exist for each:
0. application architecture style (layered/MVC, clean/hexagonal, modular
   monolith, microservices — and separately for the frontend);
1. platform: web or mobile (React or React Native) — based on the user journey;
2. repository structure (mono/polyrepo, how to split the code);
3. frontend: build, routing, working with server data, styles;
4. backend: framework, validation, error format, API style;
5. data store and ORM, with local launch and free hosting in mind;
6. authentication — taking into account the gap from the digest;
7. concurrency: how to guarantee the spot counter invariants (US-06, US-12);
8. deployment and hosting.
If you lack information for the rating — ask me before writing the plan.

After I approve the plan, write, in this order:

1. docs/analysis/options.md — for each decision, a table of options rated
   against OUR constraints (+ / 0 / −), the main criterion that tips the
   choice, and what would have to change for the choice to be different.
   At the end — a summary table: decision → what it leans toward → main
   criterion → ADR number.

2. docs/adr/NNNN-short-name.md — one file per decision, fixing the choice:
   2–3 options from options.md with trade-offs specifically for this team,
   a recommendation and consequences (what becomes simpler, what becomes
   harder, what we postpone). If you disagree with what options.md leans
   toward — say why. Format:
   # ADR-NNNN: Title
   Status | Context | Options (with pros/cons) | Decision | Consequences | Related stories.
   Add docs/adr/README.md with an index and a rule for when an ADR should be
   written and when not. Write concisely: ADRs are read, not studied.

3. docs/architecture/risks.md — a risk register in three groups: technical,
   product (requirements/user behavior), team (deadlines, skills). For each:
   probability and impact (low/med/high), trigger (how we will notice that
   the risk has fired), mitigation, and where exactly it lives (component /
   ADR). No generic phrases like "bugs are possible". Separately mark the
   risks we consciously accept for the MVP.
   docs/architecture/integrations.md — all external dependencies (Telegram,
   GitHub, hosting, DB): what exactly we take from them, whether it is an
   API integration or just a link/format, what we do if the dependency is
   unavailable.
```

---

## Step 3 — Architecture sketch and the check against the stories

**Mode:** normal mode; prompt 3b in the same session, after 3a has finished.

### Prompt 3a — the sketch

```text
Read docs/analysis/requirements-digest.md and all docs/adr/*.md. Create a sketch of
the DevMatch technical solution in docs/architecture/ — four documents and one
visual page, no application code:

1. overview.md — for a new team member who needs to understand the system in
   10 minutes: C4 level 1 (system context) and level 2 (containers) in mermaid;
   the list of components of each container with a one-phrase responsibility;
   the list of frontend pages mapped to stories; which external systems are
   real integrations and which are just links.
2. domain-model.md — for everyone who writes code or tests: entities, attributes
   with constraints (lengths, formats — from the AC), invariants, and state machines
   for Project, Role, Application in a mermaid stateDiagram with transition conditions.
   Each rule — with a reference to US-xx.
3. api.md — for the frontend and backend developer as a contract: a table
   endpoint → story → who has access → response code; a single error format
   and a dictionary of error codes derived from the Gherkin scenarios (400/401/403/404/409).
   Example request/response bodies — only for 3–4 non-trivial endpoints.
4. data-model.md — for whoever writes the DB schema: tables, fields, types, unique
   constraints, indexes, and separately — which invariants cannot be expressed by the
   schema and must live in the transaction code.
5. system.html — for a team meeting or the course owner: one self-contained HTML
   file (no external dependencies, opens from the file system) that shows the same
   system visually — context, containers with the API layers, the end-to-end
   scenario step by step, the three state machines, pages → stories, the nine
   decisions. Dark and light theme. It is a picture of the markdown documents,
   not a second source of truth: every label on it must be traceable to one of them.

If during the design you see that a story is not covered or contradicts
another — don't resolve it silently, put it in the "Open questions" section
in overview.md.
```

### Prompt 3b — the double check

```text
Go through every Gherkin scenario in docs/US-*.md and say which endpoint, which
page and which response code implements it. Write the result to
docs/architecture/traceability.md as a matrix: each story US-01…US-14 →
endpoint(s) → frontend page(s) → entities → key scenarios for tests (from
Gherkin). Add a recommended implementation order (the end-to-end journey first).
At the bottom — a list of stories that are weakly covered, depend on assumptions
from the digest, or where the answer is not obvious — and what to do about it.
Don't resolve contradictions silently: name them.
```

---

## Step 4 — Claude Code setup for the team

**Mode:** normal mode.

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

## Step 5 — Project skeleton

**Mode:** normal mode.

```text
Create the project skeleton from docs/adr/ and docs/architecture/. No business logic.

- Root: pnpm workspaces, package.json with dev / build / typecheck / test scripts
  that work for all packages; tsconfig.base.json; .env.example; README
  with launch instructions in 3 commands.
- packages/shared: zod validation schemas and status enums from domain-model.md
  (telegram username with "@" normalization, GitHub URL, length limits for project
  and role, Project/Role/Application statuses); vitest tests, where each test case
  is named after the Gherkin scenario it comes from (US-01 sc.3, etc.).
- apps/api: Express 5 + TypeScript (tsx for dev); prisma/schema.prisma from
  data-model.md; src/app.ts with /api/health, validation middleware via shared
  and an error handler in the format from api.md; empty routes/ services/ folders with
  a README explaining what goes where.
- apps/web: Vite + React + TypeScript; React Router with stubs for all pages
  from overview.md (each — a heading and a link to the story); an api client with
  the base URL from env; no styles except a minimal layout.

After creating it, run pnpm install, pnpm typecheck, pnpm test and fix everything
that fails. Show which files were created and what exactly was verified.
```

---

## Step 6 — Testing technique and the first tests

**Mode:** normal mode.

```text
Read docs/architecture/ (especially api.md, domain-model.md, traceability.md),
docs/adr/0007-concurrency.md, CLAUDE.md and the current code in apps/ and packages/.

1. Write docs/architecture/testing.md — the testing strategy for THIS project:
   the test pyramid with the share of tests per level and why; the technique
   for turning a Gherkin scenario into a test (naming convention "US-xx sc.N …",
   one scenario = one test, assert the contract not the implementation);
   how API tests get a real database (SQLite test DB, reset per test, serial
   files); how the race condition from ADR-0007 is tested; rules for e2e
   (one spec per journey, seed via API, locate by role, no sleeps); what we
   deliberately do not test; commands; the tests part of definition of done.

2. Set up the infrastructure: vitest + supertest for apps/api with a test
   database and a resetDb() helper; vitest + jsdom + Testing Library for
   apps/web; Playwright at the repo root with a config that starts both dev
   servers. Add pnpm scripts (test, test:e2e) and gitignore entries.

3. Write tests for the code that already exists, following the strategy:
   - apps/api: health endpoint; 404 in the documented error format; malformed
     JSON → 400 VALIDATION_ERROR; validateBody middleware (details per field,
     body replaced by the parsed value); the Prisma schema's unique constraints
     (User.email, Role projectId+name) against the real test DB.
   - apps/web: the NotFound page and the page stub render what the router
     promises (title, story references, catalog link).
   - e2e: one smoke journey — open /, see the navigation, see "API: ok".
   Name tests after the scenario or acceptance criterion they come from; for
   infrastructure tests, name them after the document section they protect.

4. Create two skills: /unit-tests US-xx (unit + API tests from the story's
   scenarios, using the helpers, one test per scenario, reports a coverage
   table) and /e2e-tests <journey> (Playwright spec for a journey across
   several stories, seeds via API). Update CLAUDE.md (commands, documentation
   map, skills) and settings permissions.

Run pnpm typecheck, pnpm test and pnpm test:e2e and fix whatever fails before
reporting. Report what was created and what each command verified.
```
