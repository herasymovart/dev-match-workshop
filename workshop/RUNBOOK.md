# RUNBOOK — 80 minutes, minute by minute

Legend: 🎤 — what to say · 🖥 — what to show · 💬 — the prompt (paste as is) · ⚠️ — where not to get stuck.
Every step has the same shape: *what to say → the prompt → why the prompt is written that way → what to show in the result → what to point out*. The prompts are copied from `workshop/prompts/0N-*.md`, so this file is enough on its own during the session.

## Agenda

| Time | Step | Tag | Min |
|---|---|---|---|
| 13:30 | Introduction and opening discussion ("what will you do with your requirements tomorrow?") | `step-00` | 10 |
| 13:40 | 1 · Environment and requirements analysis | `step-01` | 10 |
| 13:50 | 2 · Decisions: map of options in plan mode, ADRs, risks | `step-02` | 15 |
| 14:05 | 3 · Architecture sketch, the picture of it, and the check against the stories | `step-03` | 12 |
| 14:17 | 4 + 5 · Claude for the team (feature tour), project skeleton | `step-04`, `step-05` | 9 |
| 14:26 | 6 · Testing technique and the first tests | `step-06` | 5 |
| 14:31 | Breakout rooms | — | 12 |
| 14:43 | Wrap-up and hand-off | `main` | 7 |

The full spoken text, including the opening discussion (what to ask, how to group the answers, how to come back to them in the wrap-up), is in `SCRIPT.uk.md`; this file keeps the compact English version of each step.

The thread that runs through all six steps: **context → constraints → ask → verify → fix.** Say it in the introduction, point back to it in every step, repeat it in the wrap-up.

---

## 13:30–13:40 · Introduction and opening discussion (10 min) · `./workshop/go.sh 0`

❓ **Opening discussion (7 min, see `SCRIPT.uk.md`).** Ask: "Tomorrow you open the folder with your project's requirements. What do you do first — code, AI, a whiteboard, the team chat? Name one concrete action." Two or three answers by voice, the rest one line each in the chat; keep the chat answers for the wrap-up. Group the answers aloud: a silent decision ("I'd pick a stack"), an invisible invention ("I'd ask ChatGPT to generate it" — what does it do when login is not specified?), a document without a reader ("I'd draw the DB schema"), a decision without a record ("we'd split the work"). Second, quick question in the chat: who has used AI for design rather than code, and was it useful, noisy or dangerous?

🎤 **What to say.**
Everything you just named is a decision. You have the requirements for your project: a description, personas, user journeys, user stories with acceptance criteria. Between those requirements and the first line of code there is a layer of decisions that are the most expensive to change later: what kind of system this is, what it consists of, which technologies carry it, where it will break. That layer is called a technical solution, and today we build one for a project you have not seen before — DevMatch, a service for assembling student teams. We do it in six prompts to Claude Code. For every prompt you will see three things: the prompt itself, the result, and the place where the AI either found something humans had missed or needed a human to decide.

Two warnings up front. First: an AI will happily design a system from incomplete requirements and never tell you what it invented. Today's technique is largely about *preventing* that. Second: the AI does not know your team, your deadline or your budget until you say so. Half of a good prompt is constraints.

The principle for the whole session: context → constraints → ask → verify → fix. We give the AI the context (the docs folder, not a pasted wall of text), we state the constraints, we ask for a specific artifact in a specific place, we verify it against the requirements, and we fix what is wrong. Every prompt today has that shape.

By the end you will have seen: an analysis with open questions, a comparison of options, decisions recorded with alternatives and a risk register, an architecture sketch with diagrams, an API contract and a traceability matrix, a Claude Code setup for a team, a runnable skeleton, and a testing technique. Your final project needs the same artifacts, and the six prompts are reusable — you change the docs folder and the constraints block.

🖥 **Show.** `docs/`: three files. `project_context.md` — the product in one paragraph, six personas (two core, four "non-obvious"), value proposition canvases, two user journeys and a story map with MVP vs post-MVP. `US-INIT-1.md` — eight stories for the project lead. `US-STUD-1.md` — six stories for the student. Open US-06 (approve an application) and scroll through: story, acceptance-criteria checklist, three Gherkin scenarios including a race condition. 🎤 "This is the quality of input we have. Yours may be rougher; the technique is the same, the AI will just find more gaps."

---

## 13:40–13:50 · Step 1: environment and requirements analysis (10 min) · `./workshop/go.sh 1`

🎤 **What to say.**
The first thing I do in a new project is not code and not architecture. It is a place for context. Claude Code reads a file called `CLAUDE.md` at the start of every session; whatever is in there, the AI knows without being told again. At this stage mine is about twenty lines: what the project is, where the requirements live, the constraints I already know, and one rule — "do not invent requirements silently; if something is missing, say so and propose an assumption." That rule is the single most valuable line in the file, and you will see why in a minute.

Then the first prompt. Notice what it does *not* ask for. It does not ask for a design. It does not ask for technologies. It asks the AI to *read* and to *structure* what is there: entities and their states, business rules with the story number next to each, non-functional requirements that are implied but not written, and — the part that matters — gaps: what is missing but needed. If you ask "design me a system" at this point, the AI designs one, and quietly fills every gap with its own assumptions. Ask for the gaps first, and they become decisions you make, not accidents you discover in week three.

💬 **Prompt 1** (normal mode):

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

🎤 **Why the prompt is written this way.**
- "Read all files in docs/" — we point at the context instead of pasting it. The AI reads what it needs, and the prompt stays short enough to reuse.
- "Don't design anything" — an explicit stop. Without it the model drifts into the next step, and the analysis is contaminated by whatever architecture it already has in mind.
- A numbered output structure and a file path — so the result is a document the team can commit and review, not a chat answer that scrolls away.
- "Cite story and scenario numbers" — this turns every claim into something checkable. If the digest says "rule R8 comes from US-06 scenario 3", anyone can open the story and confirm.

🖥 **Show.** `CLAUDE.md` (the 23-line version), then `docs/analysis/requirements-digest.md`:
- **§1 entities** — scroll to the Application transition table. 🎤 "Three state machines came out of fourteen stories: Project DRAFT → PUBLISHED → CLOSED, Role OPEN → FILLED, Application PENDING → APPROVED or REJECTED. Nobody wrote 'state machine' in the requirements; the AI assembled them from acceptance criteria scattered across eight stories."
- **§2 rules** — eighteen rules, each with a source. Pick R5 (the lead's Telegram is never in public responses) and R8 (approval refused when spots are zero "even if a second ago there was one").
- **§4 open questions, question 1.** 🎤 "Read it with me. US-01 says the user 'has logged in for the first time'. US-13 says 'the current user's applications'. US-12 asks for a Telegram handle *in the application form*, as if there were no profile. Fourteen stories, and not one of them describes how a user logs in. Every one of you would have discovered this on the day you tried to write the applications page. The AI found it in ninety seconds, because we asked for gaps instead of a design."
- **§5 assumptions with risk ratings** — one line each. 🎤 "We do not accept these automatically. We see them, and we can take them to the course owner."

⚠️ Ten open questions, one deep dive. Show the list exists, read question 1, move on. The optional live prompt moves to step 2 where it is worth more.

---

## 13:50–14:05 · Step 2: decisions — map of options in plan mode, ADRs, risks (15 min) · `./workshop/go.sh 2`

🎤 **What to say.**
Before choosing anything, I want to see what I am choosing *from*. Then I want the choice recorded with the alternatives I rejected. And then I want to know where that choice will break. Those are three artifacts, but one chain of reasoning — so today they are one prompt, with a control point in the middle. This is the right moment to show you plan mode, because the two ideas are the same idea: look before you act.

Plan mode is a mode of Claude Code in which the AI reads files, runs commands to explore, asks questions and writes a plan — but does not edit anything until you approve the plan. You switch into it with Shift+Tab until the status bar says "plan mode on"; the cycle is manual → accept edits → plan. You can also start with `claude --permission-mode plan`, or prefix a single prompt with `/plan`. When the plan is ready you get three options: "Yes, and use auto mode", "Yes, manually approve edits", "No, keep planning". Ctrl+G opens the plan in your editor so you can change it by hand before approving. The documentation gives one rule for when to use it: if you could describe the diff in one sentence, skip the plan. Architecture is the opposite of one sentence.

Now the prompt. Look at the constraints block — four students, six to eight weeks, zero budget, no DevOps, a fixed stack. That block is the most important text in the whole session. Without it the AI recommends what is "industry standard" for a company of fifty engineers. With it, every option is rated against *our* situation. Then: "don't choose anything yet" — the plan is the comparison, with the criterion that tips each choice and, the part students never ask for, what would have to change for the choice to be different. Only after I approve that plan does the AI write: the comparison as a document, then one Architecture Decision Record per decision — context, options with pros and cons for us, the decision, the consequences, the related stories — and then the risk register. In a month, when someone asks "why SQLite?", the answer is in a file, with the alternatives you rejected and the reason. Without that file the answer is "I don't remember" or "the AI said so", and both are bad.

💬 **Prompt 2** (switch to plan mode first):

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

🖥 **Live demo (3 min).** The mechanics, so nothing is improvised on stage:

*What `./workshop/go.sh 1 live` does.* Tags are read-only snapshots; if you ran Claude on one and it wrote a file, you would be editing a detached checkout. The command creates a normal git branch `live/step-01` starting from the `step-01` tag and switches to it. On that branch the project is exactly as it was after step 1 — the requirements, the digest, the first CLAUDE.md — and neither `options.md` nor the ADRs exist yet. So Claude can do the step for real, in a sandbox that does not touch the prepared tags.

*The day before:* `./workshop/go.sh 1 live`, then `claude --permission-mode plan` in the repo root to confirm the status bar says "plan mode on" and that Claude sees CLAUDE.md. Exit with `/exit`. Stay on the branch, or come back to it with `git switch live/step-01`.

*On stage:*
1. Terminal at the repo root, on `live/step-01`. Start `claude --permission-mode plan` — it opens directly in plan mode, no key presses to get wrong. (If a session is already open, Shift+Tab cycles the modes until the bar says "plan mode on"; from auto mode that can take up to three presses.)
2. Paste prompt 2. 🎤 While it reads: "It is reading the digest and the context. In plan mode it cannot write a file even if it wanted to." If it asks for permission to run a read-only command such as `ls`, approve it.
3. If it asks a question, answer it. The expected questions and answers are in `workshop/plans/02-plan.md` (one course or many? → one semester; ORM experience? → basic SQL, no ORM).
4. When the plan appears — the order of decisions, the options for each, the three result files: 🎤 "This is the control point. Ctrl+G opens the plan in the editor; I can change it, reject it, or approve it. Nothing has been written yet. When I approve, the comparison I approved becomes the ADRs — the AI does not get a second chance to 'choose the stack' from scratch." Choose **No, keep planning**, then `/exit` — the finished result already exists on the tag. If you are ahead of schedule, choose "Yes, manually approve edits" and let it write options.md and the first ADR for two or three minutes instead.
5. Leave the sandbox: `./workshop/go.sh keep` (commits anything Claude wrote on the live branch) or `./workshop/go.sh discard`, then `./workshop/go.sh 2` to continue from the prepared result. The switcher refuses to move while the tree has uncommitted changes, so this order cannot be skipped by accident.

⚠️ If Claude does not start or the network is down: open `workshop/plans/02-plan.md` and say "this is the plan it produced"; continue from the tag. Lose nothing.

🎤 **Why the prompt is written this way.**
- The constraints block: the AI rates for *this* team, not in general. Every "−" in the result points at a constraint.
- "In which order (what depends on what)": decisions have dependencies — auth depends on the deployment topology, the data store depends on the budget. A plan makes the order explicit.
- "What would have to change for the choice to be different": this is the question that separates understanding from copying. It tells you what your decision rests on.
- "Ask me before writing": in plan mode the AI can ask, and the answer becomes part of the plan instead of a silent assumption.
- "After I approve the plan, write, in this order": comparison → decisions → risks. The ADRs are written from the comparison we approved; "if you disagree with what options.md leans toward — say why" makes the AI argue if its decision contradicts its own comparison.
- Item 7 (concurrency) looks like an implementation detail. It is on the list on purpose: US-06 sc.3 and US-12 sc.4 make it a requirement, and it is cheaper to decide now than to discover a race in production.
- "ADRs are read, not studied" — length is a design parameter. A two-page ADR is never opened again.
- A *trigger* and a *home* for every risk: left alone, the AI writes generic risks — "there may be bugs", "we should test". A risk with a trigger and a home is a plan; a risk without them is a worry.

🖥 **Show** `docs/analysis/options.md` (4 min):
- The constraints table K1–K8 at the top. 🎤 "Every rating in this document is against these eight rows."
- **§1 architecture style.** Five backend styles: layered (MVC-like), fat controllers, clean/hexagonal, modular monolith, microservices. Three frontend styles: pages + hooks + server-state, MVVM/global store, components with useEffect+fetch. 🎤 "Clean architecture gets a minus here not because it is bad — because it answers a question we do not have. We are not going to swap the database or the transport. Microservices get two minuses from the team size and the timeline alone. And on the frontend, a global store would duplicate the server state, which is the whole state of this app." Read the "what would change the choice" line: ten entities or two teams → modular monolith.
- **§6 authentication.** Five options, including E, "no auth, identity is the Telegram handle from the form" — rated unacceptable with the scenarios it breaks (US-05 sc.3, US-14 sc.2). 🎤 "The AI derived that from the digest. That is what the gap from step 1 turned into: a decision with options."
- The summary table at the bottom: decision → leaning → main criterion → ADR number. 🎤 "Every row became an ADR in the same session. Let's open two."

🖥 **Show** `docs/adr/` (4 min). `README.md` first: the index of nine ADRs, the template, and the rule ("write one for a framework, database, hosting, API format, auth, repository structure, or anything discussed for more than ten minutes; not for a variable name"). Then two ADRs in detail:
- `0009-architecture-style.md` — 🎤 "Layered monolith: routes handle HTTP, services hold the business rules, Prisma holds the data. Clean architecture was rejected with the reason from the comparison. On the frontend: pages, hooks, a server-state library. Look at the rules at the bottom: *a route never contains an if about statuses or counters; a component never calls fetch directly.* Those two sentences are what the architecture reviewer agent will check mechanically on workshop two."
- `0007-concurrency.md` — 🎤 "Three options: check in code, conditional UPDATE in a transaction, row locking. Option A is the one every student writes first — read the counter, if it is greater than zero, write counter minus one. Two requests read 1, both write 0, both approve. That is exactly what US-06 scenario 3 forbids. Option C does not exist on SQLite. So: B, a conditional update that only succeeds if spots are still available, and a check that exactly one row changed. The pseudocode is in the ADR; it becomes one function in the applications service, and the test for it is two parallel approvals."
- The rest — platform, monorepo, frontend, backend, data store, auth, deployment — name from the index. 🎤 "Nine files, each one page. They map one to one onto the summary table of options.md."

🖥 **Show** `docs/architecture/risks.md` and `integrations.md` (3 min):
- 🎤 "Where will this break? The AI is useful here for a reason that sounds odd: it has no ego about the decisions it just recorded. It will tell you SQLite on a free tier can lose data without defending the choice." One technical, one team. T2 — "the lead's Telegram leaks into a public response": trigger is any public JSON containing the field; mitigation is a serializer layer as the only place responses are built, plus a test that the field is absent. C4 — "the AI generates code the team does not understand": trigger is a review where the author cannot explain a line; mitigation is a review rule — the author explains every non-trivial block, the reviewer agent checks conformance to ADRs, the human checks understanding. 🎤 "That second one is about you. It is the main risk of this whole way of working, and the mitigation is a habit, not a tool." Then the section "consciously accepted for the MVP". 🎤 "No password recovery, one instance with SQLite, no rate limiting until the first spam signal. Accepting a risk on purpose is fine. Accepting it by not noticing is not."
- `integrations.md` in one sentence: "In the MVP there is not a single API integration" — Telegram and GitHub are links and formats — and a table of what happens if each dependency is unavailable. 🎤 "That is a decision too, and it protects you from the most common scope creep: 'let's add a bot'."

🎤 **Technique to name.** When a recommendation does not convince you, do not ask "convince me". Ask: "under which constraints would you recommend NestJS / clean architecture / option B instead?" The answer shows what the rating rests on — and that is the question you should be able to ask about your own project.

---

## 14:05–14:17 · Step 3: architecture sketch, the picture of it, and the check against the stories (12 min) · `./workshop/go.sh 3`

🎤 **What to say.**
Now the sketch itself — the thing the workshop title promises. Four documents, and the key to the prompt is that each one names its *reader*. The overview is for a new team member who has ten minutes. The domain model is for everyone who writes code or tests — it is where we agree on words and states. The API contract is for the frontend and the backend developer so they can work in parallel without waiting for each other. The data model is for whoever writes the schema and the migrations. The reader determines the level of detail. A document without a named reader becomes a document nobody reads.

Diagrams are in Mermaid inside Markdown. They render in GitHub and in your IDE, they live next to the text, and they are diffed in pull requests. A diagram in a drawing tool is out of date the week after it is drawn; a diagram in the repository is updated in the same commit as the code.

The last paragraph of the prompt is the same rule as in step 1, applied to design: if a story is not covered or contradicts another, do not resolve it silently — write it in the open questions.

One more thing in this prompt that was not in the title: a picture. Four markdown files are right for the people who build the system. They are wrong for the course owner, for a new teammate on day one, and for a projector. So the fifth item asks for one self-contained HTML page that draws what the four documents say. The order matters: the picture is asked for last and derived from the text, so it cannot contain an arrow the text does not have.

And then a second prompt, in the same session: the check. Go through every story and say what implements it. The result is a traceability matrix — every story mapped to its endpoints, pages, entities and tests. If a story has no endpoint, the architecture is incomplete. If an endpoint has no story, we are building something nobody asked for. It is a separate prompt on purpose: the AI that just wrote the sketch is now asked to audit it, story by story.

💬 **Prompt 3a** (normal mode):

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

💬 **Prompt 3b** (same session, after the sketch):

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

🎤 **Why the prompt is written this way.**
- "Read the digest and all ADRs" — the sketch is derived from decisions already made, not improvised. If the sketch contradicts an ADR, one of them is wrong and we find out now.
- One reader per document, stated in the prompt.
- "Example bodies only for 3–4 non-trivial endpoints" — a limit on detail. Without it you get forty JSON examples nobody maintains.
- "Which invariants cannot be expressed by the schema" — this question forces the AI to admit the limits of the tools (and it does: no partial unique index on SQLite through Prisma).
- "One self-contained file, no external dependencies" — it opens from the file system in any browser, on the day of the demo, with no network. "Not a second source of truth" — when the picture and the text disagree, the text wins, and the page says so in its footer.
- The check is a second prompt, not a sixth item: "go through every scenario and say what implements it" is an audit question, and an audit written in the same breath as the thing audited finds nothing.

🖥 **Show** (9 min: the picture first, then one or two places in each file, then the matrix):
- `open docs/architecture/system.html` (browser, dark theme; keys `1`–`6` switch tabs). Tab 1, Context: 🎤 "Two kinds of people, one system. The two boxes on the right are dashed on purpose: links, not integrations." Tab 2, Containers: 🎤 "One Node process. Inside the API, five layers, and only one box is allowed to touch the spot counter — the bold one." Tab 3, press Play (or Space): 🎤 "This is the intersection of the two journeys. Step 6 is the transaction: the conditional update is why two leads racing for the last spot cannot both win." Tab 4, States: 🎤 "Three machines; the dashed line between FILLED and APPROVED says they move in the same transaction." Skip tabs 5 and 6 unless asked — they are the pages and the ADRs as cards. Then switch to the IDE: 🎤 "Everything you just saw is a label from one of these four files. Let's read the places the picture cannot show."
- `overview.md`: the C4 context diagram. 🎤 "Two arrows go to Telegram and GitHub, and the note under the diagram says: these are not integrations. We never call their APIs. We validate a format and render a link. Students — and AIs — love to draw extra arrows; this one caught itself." Then the sequence diagram of the end-to-end scenario: student applies, lead approves, student sees the Telegram contact. 🎤 "That is the point where the two user journeys from the context document meet. The requirements called it the intersection; here it is as a sequence."
- `domain-model.md`: the Application and Role state machines side by side. 🎤 "One transition — approve — changes two entities: the application's status and the role's counter, possibly the role's status too. One transition, two entities, therefore one transaction. That is ADR-0007 showing up in the model." Then the table "who sees what". 🎤 "Four columns, and every ✘ in it is a security test."
- `api.md`: the endpoint table (method, path, story, access, codes), the single error format, and the error dictionary. 🎤 "Fifteen error codes, every message traced to the scenario it came from. The frontend shows `error.message` as is. And look at `GET /me/applications`: the `leadTelegram` field is *absent* — not null, absent — unless the application is APPROVED. That is US-14 scenario 2, and it is one line in a contract, not a feature."
- `data-model.md`: the table "invariants the schema cannot express". 🎤 "This is the most honest part of the whole sketch. Prisma on SQLite has no enums and no partial unique indexes, so 'one active application per user and role' lives in a transaction, not in the database. The document says where."
- `traceability.md`: the matrix, then "recommended implementation order". 🎤 "First the end-to-end path — create, publish, see, apply, approve. After five stories the whole journey demos. Then everything else. This is the plan for workshop two."
- **The last row of the "weakly covered" table.** 🎤 "US-08 says: when recruitment is closed, the project gets a 'Recruitment closed' badge in the catalog. US-09 says: the catalog shows only PUBLISHED projects. A closed project is not PUBLISHED, so it is not in the catalog, so the badge can never be shown there. Two stories, written by the same person, contradict each other. We did not see it in step 1. We saw it when we checked the architecture against every story. This is why the check exists — and the answer is not the AI's to give. It is a question to the course owner."

🎤 **Technique to name.** The double check. Never let the thing that wrote the design also certify it in the same answer. Ask separately: "go through every scenario and say what implements it; where the answer is not obvious — mark it." Holes appear.

---

## 14:17–14:26 · Steps 4 and 5: Claude for the team + skeleton (9 min) · `./workshop/go.sh 4`, then `5`

🎤 **What to say.**
So far the AI worked for one person. On a team of four, every person has their own terminal and their own session, and the question becomes: how do we make all four sessions work by the same rules and see the same architecture? The answer is that the documents we just wrote *are* the AI's memory. `CLAUDE.md` does not repeat them; it points at them and says what to read before which kind of task. Skills are the team's repeatable processes written down once: "this is how we take a story into work". An agent is a second pair of eyes with a narrow job: compare a diff to the ADRs.

That was the setup most teams stop at. The rest of this step is the part they discover a month later, so we switch it on today. Three groups:

1. **Instructions, scoped.** `CLAUDE.md` for everyone, always. `.claude/rules/*.md` with a `paths:` list for things that matter only when you touch that folder — the API conventions load when you open a file in `apps/api/`, not when you write a React component. That is how CLAUDE.md stays at seventy lines. `CLAUDE.local.md` for your personal notes, gitignored.
2. **Guard-rails that do not depend on reading.** Permissions in `settings.json` say what runs without asking and what never runs. A hook is stronger than a rule: a rule is advice, a hook is enforcement. Ours blocks any edit to the course owner's input documents and tells the AI where to put the problem instead.
3. **Parallelism.** One story per worktree: `claude -w us-06` gives you a separate checkout and a branch, so the API story and the web story do not fight over the same files. A fork copies a conversation so you can try two designs from the same context and keep the better one. Checkpoints let you rewind the code and the conversation when an experiment goes wrong.

Then the skeleton. Everything in it follows from the documents — the folder structure from ADR-0009, the schema from the data model, the validation schemas from the domain model, the error handler from the API contract. The prompt forbids business logic. The point of the skeleton is that workshop two starts with `pnpm install && pnpm dev`, not with a day of configuration.

💬 **Prompt 4** (normal mode):

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

🎤 **Why the prompt is written this way.**
- Items 1–4 are the files every team needs; 5–7 are the ones that keep working when nobody re-reads CLAUDE.md. Ask for all of them in one prompt: the AI already has the ADRs and the architecture in context, and the rules it writes come from them.
- "Verbatim" for the ADR-0007 pattern: the one piece of code we want copied, not re-invented, lives in a rule next to the files that will use it.
- "No dependencies" for the hook: it must run on a fresh clone before `pnpm install`.
- "One line each in CLAUDE.md": the features are discoverable from the one file everyone reads, the details stay in the tool's docs.

🖥 **Show** (4 min, `go.sh 4`):
- `CLAUDE.md` v2 — the documentation map table ("implement a story → read the story, its traceability row, api.md, domain-model.md"), the rules that follow from ADRs, the definition of done, and the last two lines of "Working with Claude". 🎤 "Seventy lines. If it grows past that, something belongs in docs, in a rule or in a skill instead."
- `.claude/skills/implement-story/SKILL.md` — read the four headings aloud: read, don't assume → plan and *wait* → implement → close. 🎤 "A skill is not magic. It is a markdown file with a process. The 'wait for confirmation' line is the same control point as plan mode — the human approves before code is written." Point at the frontmatter: `argument-hint` is what the user sees after `/implement-story`, `$ARGUMENTS` is where `US-06` lands.
- `.claude/rules/api.md` — the `paths:` frontmatter and the transaction block. 🎤 "This file is invisible until you open something in apps/api. Then it is in context, with the exact code we want for the counter."
- `.claude/settings.json` — the `allow` and `deny` lists, then the `hooks` block; `.claude/hooks/protect-input-docs.mjs` is twenty lines. 🎤 "Exit code 2 means: blocked, and the text on stderr goes back to the AI as the reason. A rule is advice; this is enforcement." If the morning check passed, do it live (30 s): in `claude`, type `add the sentence "test" to docs/US-INIT-1.md` and show the refusal.
- `.claude/agents/architecture-reviewer.md` — the checklist: validation via shared, errors via the documented codes, no business logic in routes, counters only in transactions, no Telegram leaks. 🎤 "It checks against ADRs, not against taste."

🎤 **Feature tour** (2 min, on screen as a table — read the left column, say one sentence each; the right column is for the students afterwards). Verified against the Claude Code docs for 2.1.x; where this repo has the thing, the last column says where.

| Feature | What it is | Switch it on from day one because… | In this repo |
|---|---|---|---|
| `CLAUDE.md` | Loaded at the start of every session. `@path` imports other files (max 4 hops). `CLAUDE.local.md` for personal notes — add it to `.gitignore` yourself. | It is the only thing every session on the team reads. | v2 at `step-04`, v3 after step 6 |
| `.claude/rules/*.md` | Instructions with a `paths:` glob list; loaded when a matching file is read or edited. No `paths:` → always loaded. | Keeps CLAUDE.md short; folder-specific rules land only where they apply. | `api.md`, `web.md`, `input-docs.md` |
| Skills | `.claude/skills/<name>/SKILL.md`; `/name args` or invoked by Claude from the description. Frontmatter: `argument-hint`, `allowed-tools`, `disable-model-invocation`, `user-invocable`, `context: fork` (runs in a subagent without the conversation history). Supporting files in the folder load on demand. | The team's processes, written once, run the same way in four terminals. | `implement-story`, `adr`, `check-story`; `unit-tests`, `e2e-tests` from step 6 |
| Subagents | `.claude/agents/<name>.md` with `tools`, `model`, `isolation: worktree`; own context window. `/agents` lists them; `claude --agent <name>` starts a session as one. | A reviewer with a narrow brief and read-only tools cannot "fix" what it reviews. | `architecture-reviewer` |
| Hooks | `settings.json` → `hooks`; events such as `PreToolUse`, `PostToolUse`, `Stop`, `SessionStart`; matcher `Edit\|Write`; exit 2 blocks and returns stderr to Claude. `/hooks` shows them. | Enforcement instead of advice: formatters, forbidden paths, "run typecheck before you stop". | `protect-input-docs.mjs` |
| Permissions | `permissions.allow` / `deny`; modes `default`, `acceptEdits`, `plan`, `auto`, `dontAsk`, `bypassPermissions`; Shift+Tab cycles; `--permission-mode`. `settings.local.json` for personal overrides. | No prompt for `pnpm test`, never a prompt for `git push --force` — it is denied. | allow pnpm + read-only git; deny force push, `rm -rf`, `.env` |
| Plan mode | Read-only until you approve a plan; `claude --permission-mode plan`, `/plan`, Shift+Tab. | Decisions get a real approval moment (step 2). | `workshop/plans/02-plan.md` |
| Worktrees | `claude -w <name>` → checkout in `.claude/worktrees/<name>`, branch `worktree-<name>`; `claude -w <name> --resume` to come back; on exit Claude asks keep or remove if there are changes. Not gitignored automatically. | One story per worktree: parallel work, no half-finished files in the shared checkout. | `.gitignore` line |
| Forks and branches | `/fork` copies the conversation into a new background session; `/branch` branches it in place; `claude --continue --fork-session` on the CLI; `/subtask <task>` runs a subagent that inherits the whole conversation. | Try two designs from the same context, keep one. | — |
| Checkpoints | `/rewind` or Esc Esc: restore code, conversation or both to an earlier point. Changes made by shell commands are not tracked. | Experiments become cheap. | — |
| Memory | Auto-memory per project in `~/.claude/projects/<project>/memory/` with a `MEMORY.md` index; `/memory` edits the files; "add this to CLAUDE.md" for team-wide facts. | Facts survive the session; team facts go to the repo, personal ones stay local. | — |
| Context control | `/context` shows what fills the window; `/compact <focus>`; `/clear`; `@path` to mention a file; `!cmd` to run a shell command and keep its output. | Long sessions degrade; know when to compact. | — |
| MCP | `.mcp.json` checked in, `claude mcp add --transport http <name> <url> --scope project`; approval on first use; `/mcp`. | Tools the model can call: a browser, your tracker, a database. Playwright MCP is the natural one for this stack. | not yet — add when a story needs it |
| Headless / CI | `claude -p "…" --output-format json`; GitHub Action `anthropics/claude-code-action` (`/install-github-app`), triggered by `@claude` in a PR. | `/check-story US-06` as a PR comment, every PR. | candidate for workshop two |
| Plugins | `/plugin`, marketplaces: skills + agents + hooks packaged for a team or a course. | When three repos share the same setup. | — |
| Background | Ctrl+B sends a long command or agent to the background; `/loop` for recurring prompts; `/statusline`. | Tests run while you keep working. | — |

⚠️ Do not demo worktrees or forks live during the step; the tour is a table and a sentence each. If time is left at the end, `claude -w demo` is a safe one-minute demo: it creates the worktree, you `/exit`, answer "remove".

💬 **Prompt 5** (normal mode):

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

🖥 **Show** (3 min, `go.sh 5`):
- `./workshop/go.sh diff 4 5` — about fifty files. 🎤 "And not one line of business logic. The skeleton comes from our ADRs, not from the AI's idea of a typical project."
- `packages/shared/src/__tests__/validation.test.ts` — the test names: `US-01 sc.3 "orest lead!" (forbidden chars) and "abc" (< 5 chars) are rejected`. 🎤 "The first bridge from Gherkin to code. A rule in the acceptance criteria became an `expect`."
- `apps/api/prisma/schema.prisma` next to `docs/architecture/data-model.md`. 🎤 "They match one to one. If they ever disagree, the document wins, because people reviewed the document."
- Terminal: `pnpm typecheck && pnpm test`, green. 🎤 "The last line of the prompt says run it and fix what fails. 'It looks right' is not a verification."

⚠️ Do not run `pnpm dev` live unless it worked in the morning; the test run is enough.

---

## 14:26–14:31 · Step 6: testing technique and the first tests (5 min) · `./workshop/go.sh 6`

🎤 **What to say.**
The skeleton exists. Before the first story we decide how we *prove* things, because the first story will be built on whatever ground we have now, tested or not. The good news: the Gherkin scenarios are already tests in disguise. Given is the arrangement, When is the action, Then is the assertions. The technique is to make that literal: one scenario, one test, and the test is *named after the scenario* — `US-06 sc.3 approve when no spots left → 409`. That naming is the cheapest traceability there is, and it is what lets the check-story skill grep for coverage.

The prompt has the same order as the architecture steps: the strategy document first, then the infrastructure, then tests for what already exists. And it ends with "run them and fix what fails". Tests that were only written do not count.

💬 **Prompt 6** (normal mode):

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

🖥 **Show** (3 min):
- `docs/architecture/testing.md` → "From Gherkin to a test" and the example mapping table. 🎤 "Most story tests in this project are API tests, because every acceptance criterion here is phrased as server behavior: a status code, a counter, a field missing from JSON. An API test checks exactly that against a real SQLite file, with no mocks, in ten milliseconds. End-to-end is for journeys — two or three in total, not one per story." Scroll to the race-test snippet: two approvals in `Promise.all`, expect one 200 and one 409. 🎤 "This is the only test that can prove ADR-0007. A sequential test cannot."
- `apps/api/tests/app.test.ts` and `tests/db.test.ts` — tests for the skeleton: the error format from api.md, the validation middleware with the US-01 message, the unique constraints from data-model.md. `./workshop/go.sh diff 5 6` — 🎤 "Twenty-four tests now, thirteen before, and the ones that were added protect the documents, not just the code."
- `e2e/smoke.spec.ts` — seventeen lines; the Playwright config starts both servers. 🎤 "Journeys only. No validation messages through the browser."
- `.claude/skills/unit-tests/SKILL.md` — the plan table (scenario → level → arrange, act, assert) comes *before* any code, and the report is a coverage table. 🎤 "On workshop two the loop per story is `/implement-story` → `/unit-tests` → `/check-story`."

🎤 **Technique to take home.** "List every Gherkin scenario in US-06 and write the test *name* for each. Do not write the test yet." Names first, code second. The names are the plan, and a name you cannot write is a scenario you do not understand.

⚠️ Do not run `pnpm test:e2e` live unless it passed in the morning; `pnpm test` (about three seconds) is safe to show.

---

## 14:31–14:43 · Breakout rooms (12 min)

🎤 **What to say.** "Now you. Rooms of three or four. You have eight minutes to produce an architecture sketch at the same altitude we just used, for one of two things: your own final project if your team is formed, or an extension of DevMatch with one of the personas we skipped — mentor, course instructor, moderator, Telegram notifications, a non-technical student. Use Claude or whatever you have; the prompt is in the file. The template is five items: an entity with states, the components it touches, one decision with the alternative you rejected and why, one risk with a trigger, one question for the course owner. One hard requirement: every item points at a requirement or a constraint. 'We chose X because it is popular' is not accepted."

🖥 Share `workshop/breakout.md` on screen while reading the task. Timer visible. A message to all rooms at six minutes.

**Share-out (4 min, one minute per room).** Each room: one entity or state, one decision with the rejected alternative, one risk with its trigger. You comment with one sentence per room: which item would go into an ADR, and which is a question for the course owner. Keep it moving; two rooms if time is short.

---

## 14:43–14:50 · Wrap-up and hand-off (7 min)

🎤 **What to say.**
Start from the chat answers of the opening discussion: "pick a stack" became step 2 and a table of options against eight constraints; "draw the schema" became step 3 and got a reader; "ask the AI to generate it" happened six times, each time with context, constraints, a named artifact and a check; "start with code" became step 5, last, and with no business logic in it.

What we did in six prompts: an analysis that surfaced ten open questions, the biggest being that nobody wrote how users log in. One plan-mode session that gave us a map of options rated against our constraints — approved before a file existed — nine decisions recorded with the alternatives we rejected, and a risk register with triggers. An architecture sketch with diagrams, a domain model with three state machines, an API contract with every error code traced to a scenario, a data model honest about what the database cannot enforce, and a traceability matrix that caught two stories contradicting each other. A Claude Code setup so four people work by the same rules, with guard-rails that hold even when nobody re-reads them, and a picture of the system for the people who will not read the documents. A skeleton that passes its checks. And a testing technique that turns Gherkin into test names.

For your own project: the same six prompts, in `workshop/prompts/`. You change two things — the `docs/` folder, and the constraints block. Everything else transfers.

Three things the AI will not do for you, and we saw each one today:
1. It does not know your constraints until you state them. Prompt 2 is half constraints.
2. It will not go to the course owner with an open question. The auth gap in step 1 and the US-08/US-09 contradiction in step 3 are yours to resolve.
3. It does not own the decision. You approve the plan; you sign the ADR. Plan mode exists precisely so that approval is a real moment and not a formality.

The second workshop starts from `main` of this repository: `/implement-story US-01`, then the order from the traceability matrix — the end-to-end path first. Tests from Gherkin with `/unit-tests`, coverage with `/check-story`, review with the architecture reviewer. Bring your questions for the course owner; some of them are already written down in the overview.

Questions. The repository link goes in the chat.

---

## Fallback options

- **Claude does not start / no network:** the whole workshop runs from the tags with no live prompt. Plan mode is shown through `workshop/plans/02-plan.md` (the plan) and `step-02` (the result).
- **Running 5+ minutes behind after step 3:** step 2 — skip the live demo, show the plan file, options §1 and ADR-0007 only (8 min); step 3 — tabs 1 and 3 of `system.html`, then the traceability matrix and the US-08/US-09 contradiction (6 min); steps 4–5 — the feature tour as a table only (no files), CLAUDE.md v2 and `diff 4 5` (4 min); step 6 — only the "From Gherkin to a test" section of testing.md and the 24-vs-13 test count (2 min).
- **Opening discussion runs long (over 8 min):** drop the second question, take answers in the chat only.
- **Running 10+ minutes behind:** breakout shortens to 6 + 3 min; share-out from two rooms of your choice.
- **Time left over:** let plan mode finish writing options.md and the first ADR on `live/step-01`; or the hook demo and `claude -w demo` from step 4.
