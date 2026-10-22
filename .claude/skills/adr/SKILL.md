---
name: adr
description: Create a new Architecture Decision Record in docs/adr/ with the next number, using the project template, requiring at least two alternatives with trade-offs for this team. Use when a technology, structure, API-contract or infrastructure decision is being made or questioned.
argument-hint: short decision title
---

Create a new ADR for: `$ARGUMENTS`.

1. Read `docs/adr/README.md` (template and "when to write" rule). If the decision does not meet the rule, say so and stop.
2. Determine the next number: list `docs/adr/*.md`, take max + 1, zero-padded to 4 digits.
3. Gather context before writing: which user stories (US-xx) and which existing ADRs this touches; the team constraints (3–4 students, 6–8 weeks, zero infra budget, TS/React/Node only, must run locally with one command). Ask the user for constraints you cannot infer; do not guess.
4. Write `docs/adr/NNNN-<kebab-title>.md` following the template exactly. Requirements:
   - at least two alternatives, each with pros and cons **for this team**, not in general;
   - a decision with the reason it fits these constraints;
   - consequences: what gets easier, what gets harder, what is postponed, when to revisit;
   - status `proposed` unless the user says it is accepted.
5. Add a row to the index table in `docs/adr/README.md`. If this supersedes an older ADR, set that one's status to `superseded by ADR-NNNN`.
6. Report the file path and one sentence summarizing the decision.
