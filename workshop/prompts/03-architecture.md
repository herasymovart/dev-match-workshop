# Step 3 — Architecture sketch, and the check against the stories

**Goal:** get a *high-level sketch* the team can hold in their heads: components, domain model, API contract, data schema. No code. Then check the sketch against every story.
**Why exactly these four documents:** overview — to agree on boundaries; domain-model — to agree on words and states; api — so that frontend and backend can work in parallel; data-model — so that migrations don't have to be rewritten every week.
**Plus one picture:** `system.html` — the same system drawn, for people who will not read four markdown files (the course owner, a new teammate, you on a projector). The text stays the source of truth; the page is derived from it.
**Plus the check:** `traceability.md` — every story mapped to its endpoints, pages, entities and test scenarios. It is asked for in a *second* prompt, after the sketch, because it is a verification: if a story has no endpoint, the architecture is incomplete; if an endpoint has no story, we are doing extra work.

**What to show students in the prompt:**
- each document has a *consumer* (who will read it and why) — this determines the level of detail;
- we demand traceability to the stories — every rule with a US-xx;
- mermaid diagrams live in markdown and render in GitHub/IDE — a cheap way to keep diagrams up to date;
- the visual page is asked for *last* and *derived* from the documents — the AI draws what it has already written, so the picture cannot say something the text does not;
- the check is a separate prompt: the AI that just wrote the sketch is asked to go through the stories one by one and say what implements each.

---

## Prompt 3a — the sketch

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

## Prompt 3b — the double check (same session, after the sketch)

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

**After the result, pay attention to:**
- `open docs/architecture/system.html` — tabs 1–4 are the demo (keys 1–6 switch tabs, Space plays the flow, ←/→ step through it). Check that every label on the page exists in a markdown document; if the picture has an arrow the text does not, the picture is wrong.
- in overview: Telegram and GitHub are *not* integrations, but links. AI (and students) often draw extra arrows.
- the Application + Role state machine: show how one transition (APPROVE) changes two entities — this is the "intersection point" with the user journey.
- api.md: US-14 — the lead's contact is filtered *on the backend*, not on the frontend. This is a row in the table, not a feature.
- traceability.md: the matrix, then "recommended implementation order" — the end-to-end path first (create, publish, see, apply, approve); after five stories the whole journey demos. This matrix becomes the implementation plan and the review checklist for the second workshop.
- **The last row of the "weakly covered" table** — US-08 says a closed project gets a "Recruitment closed" badge in the catalog; US-09 says the catalog shows only PUBLISHED projects. Two stories contradict each other. Nobody saw it in step 1; it appeared when the architecture was checked against every story. The answer is not the AI's to give — it is a question to the course owner.
