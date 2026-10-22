# Step 2 — Decisions: map of options (in plan mode), ADRs, risks

**Goal:** in one pass go from "what are we choosing from" to "what we chose, why, and where it will break" — with a control point in the middle. The *plan* is the map of options: it is reviewed and approved before a single file is written. After approval Claude records the decisions as ADRs and writes the risk register and the list of external dependencies.
**Why one step:** the three artifacts are one chain of reasoning: options rated against constraints → a decision with the alternatives it rejected → the risks the decision carries. Keeping them in one plan-mode session means the approval of the plan is the approval of the comparison, and the ADRs are written from the comparison we approved — not from a fresh "choose the stack".
**Why not "choose the stack" straight away:** if you ask that, the AI gives one answer. If you ask "compare the options against our constraints" — we get a table that shows *what exactly* tips the choice, and what would have to change for the choice to be different. This is what design is. The decision comes second, and it is recorded with the alternatives so that a month later someone can understand *why*.

## Plan mode: what it is and why it is here

Plan mode is a Claude Code mode in which Claude **reads files and explores, but edits nothing** until you approve the plan. Ideal for tasks where you first need to understand and then act: architecture, multi-file refactoring, unfamiliar code. The rule from the documentation: "if the diff can be described in one sentence — you don't need a plan".

| Action | How |
|---|---|
| Turn on | `Shift+Tab` several times until **plan mode on** appears in the status bar (cycle: manual → accept edits → plan) · or start `claude --permission-mode plan` · or prefix a single prompt with `/plan` |
| What Claude does | reads `docs/`, runs commands to explore (`ls`, `git log`…), asks clarifying questions, writes a plan |
| When the plan is ready | a choice appears: **Yes, and use auto mode** / **Yes, manually approve edits** / **No, keep planning**. `Ctrl+G` — open the plan in the editor and fix it by hand before approving |
| After approval | Claude executes the plan in the chosen mode; the plan is saved in `~/.claude/plans/` |
| Exit without a plan | `Shift+Tab` once more |

What to show students on screen: (1) the status bar with "plan mode on"; (2) Claude asks questions instead of writing right away; (3) the plan with the list of decisions and the options for each; (4) the moment of approval — this is your point of control: the comparison is approved, the decisions get written.

## Prompt (in plan mode)

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

## What happens next (the on-screen scenario)

1. Claude in plan mode reads docs, possibly asks 1–2 questions (for example: "will there be several teams / several courses in the system?" — answer: no, one semester, A7 from the digest).
2. It shows the plan: the order of decisions (platform → repository → architecture style → backend/frontend → data → auth → deployment), the options for each, and the three result files. A saved copy of this plan is `workshop/plans/02-plan.md`.
3. We read the plan (30 seconds), optionally edit it via `Ctrl+G`, choose **Yes, manually approve edits**.
4. Claude writes `docs/analysis/options.md`, then `docs/adr/0001…0009` + `README.md`, then `risks.md` and `integrations.md`. The result is on tag `step-02`.

## After the result, pay attention to

**options.md**
- §1 architecture style: Clean/Hexagonal gets a "−" not because it is bad, but because it answers a question we don't have (changing the DB/transport). Microservices — "−−" because of K1/K2/K8. For the frontend: a global store would duplicate server state — hence a server-state library.
- §6 auth: option E "no auth" is explicitly marked unacceptable with references to the scenarios it violates. The AI derived this from the digest on its own.
- §7 integrations: "there is not a single API integration in the MVP" — this is a decision, and it protects against the most common scope creep ("let's add a bot").
- The summary table "what we fix in ADRs" — each row became an ADR in the same session.

**docs/adr/**
- ADR-0009 (architecture style): the layered structure is chosen not because "that's the right way", but because Clean/Hexagonal answers a question we don't have. Show the rule "a route contains no if about statuses".
- ADR-0001 (web vs RN): the decision follows from the *requirements* (links in chats, a public catalog without registration), not from taste.
- ADR-0006 (auth): the AI should propose the cheapest option that closes the gap, and postpone OAuth to post-MVP.
- ADR-0007 (concurrency): a conditional UPDATE in a transaction is an *architectural* decision, even though it looks like an implementation detail. These are exactly the things worth fixing before the code starts.

**risks.md and integrations.md**
- The AI has no self-serving bias — it doesn't mind admitting that a decision it just recorded has weak spots. But it tends to generate "generic" risks; that is why the prompt demands a trigger and the place of the mitigation in the architecture.
- The "SQLite + several instances" risk — an example of a risk that is accepted consciously and has a recorded trigger.
- C4 "the AI generates code the team does not understand" — the main risk of this whole way of working; the mitigation is a review habit, not a tool.
- integrations.md in one sentence: "In the MVP there is not a single API integration", and a table of what happens if each dependency is unavailable.

**Technique:** if you don't like a recommendation — don't ask "convince me", ask "under which constraints would you recommend NestJS / Clean Architecture / option B?" The answer shows what the rating rests on.
