# Step 2 — Map of decisions and options (in plan mode)

**Goal:** before *choosing* anything, see *what* we are choosing from: architecture styles (layered/MVC, clean, modular monolith, microservices), platform, frontend/backend tools, data store, auth, integrations, deployment — and the criteria by which the options are rated for *this* team.
**Why a separate step:** if you ask "choose the stack", the AI will give one answer. If you ask "compare the options against our constraints" — we get a table that shows *what exactly* tips the choice, and what would have to change for the choice to be different. This is what design is.

## Plan mode: what it is and why it is here

Plan mode is a Claude Code mode in which Claude **reads files and explores, but edits nothing** until you approve the plan. Ideal for tasks where you first need to understand and then act: architecture, multi-file refactoring, unfamiliar code. The rule from the documentation: "if the diff can be described in one sentence — you don't need a plan".

| Action | How |
|---|---|
| Turn on | `Shift+Tab` several times until **plan mode on** appears in the status bar (cycle: manual → accept edits → plan) · or start `claude --permission-mode plan` · or prefix a single prompt with `/plan` |
| What Claude does | reads `docs/`, runs commands to explore (`ls`, `git log`…), asks clarifying questions, writes a plan |
| When the plan is ready | a choice appears: **Yes, and use auto mode** / **Yes, manually approve edits** / **No, keep planning**. `Ctrl+G` — open the plan in the editor and fix it by hand before approving |
| After approval | Claude executes the plan in the chosen mode; the plan is saved in `~/.claude/plans/` |
| Exit without a plan | `Shift+Tab` once more |

What to show students on screen: (1) the status bar with "plan mode on"; (2) Claude asks questions instead of writing right away; (3) the plan with the list of decisions; (4) the moment of approval — this is your point of control.

## Prompt (in plan mode)

```text
Read docs/analysis/requirements-digest.md and docs/project_context.md.

We are at the design stage. Team constraints:
- 3–4 students, basic TypeScript / React / Node.js, no DevOps experience;
- 6–8 weeks until the demo, in parallel with other courses;
- allowed stack: only TypeScript, React or React Native, Node.js;
- 0 UAH for infrastructure; local launch with one command after clone;
- we will work on the code with Claude Code.

Make a plan: which technical decisions must be made before the code starts, in
which order (what depends on what), and which options exist for each. Be sure to
cover: the application architecture style (layered/MVC, clean/hexagonal, modular
monolith, microservices — and separately for the frontend), the platform
(web / mobile), frontend and backend tools, API style, data store, authentication
(taking into account the gap from the digest), integrations, deployment.

Don't choose anything. The result of the plan is the document docs/analysis/options.md:
for each decision, a table of options rated against OUR constraints
(+ / 0 / −), the main criterion that tips the choice, and what would have to
change for the choice to be different. If you lack information for the rating —
ask me before writing the plan.
```

## What happens next (the on-screen scenario)

1. Claude in plan mode reads docs, possibly asks 1–2 questions (for example: "will there be several teams / several courses in the system?" — answer: no, one semester, A4 from the digest).
2. It shows the plan: the order of decisions (platform → repository → architecture style → backend/frontend → data → auth → deployment) and the structure of the future document. A saved copy of this plan is `workshop/plans/02-plan.md`.
3. We read the plan (30 seconds), optionally edit it via `Ctrl+G`, choose **Yes, manually approve edits**.
4. Claude writes `docs/analysis/options.md`. The result is on tag `step-02`.

## After the result, pay attention to

- §1 architecture style: Clean/Hexagonal gets a "−" not because it is bad, but because it answers a question we don't have (changing the DB/transport). Microservices — "−−" because of K1/K2/K8. For the frontend: a global store would duplicate server state — hence a server-state library.
- §6 auth: option E "no auth" is explicitly marked unacceptable with references to the scenarios it violates. The AI derived this from the digest on its own.
- §7 integrations: "there is not a single API integration in the MVP" — this is a decision, and it protects against the most common scope creep ("let's add a bot").
- The summary table "what we fix in ADRs" — the bridge to the next step: each row will become an ADR.
- Technique: ask "under which constraints would you recommend NestJS / Clean Architecture?" — the answer shows what the rating rests on.
