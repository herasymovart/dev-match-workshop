# Step 1 — Requirements analysis (we design nothing)

**Goal:** make the AI *read* the requirements and extract their structure: entities, states, rules, gaps.
**Why this first:** if you ask "design the system" right away, the AI will silently invent the missing requirements. We want it to *name* them.

**What to show students in the prompt:**
- we point to *where* the context is (`docs/`) instead of pasting it into the chat;
- we explicitly forbid taking the next step ("don't choose technologies");
- we ask for a *format* and a *location* for the result;
- we ask it to reference story numbers — this makes the result verifiable.

---

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

**After the result, pay attention to:**
- section 4: the AI should find that *authentication is not described anywhere* (US-01 says "signed in", US-13 — "the current user's applications", and US-12 asks for Telegram in the form as if there were no profile). This is the main lesson of the step.
- section 1: three state machines (Project, Role, Application) — they will become the foundation of the data model.
- section 3: the race condition in US-06 sc.3 and US-12 sc.4 — this is where the transaction requirement comes from.
