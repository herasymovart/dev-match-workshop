# Breakout rooms task (8 min of work + 4 min of share-out)

Rooms of 3–4 people. You can (and should) use Claude / ChatGPT — the prompt is below. The result is 8–10 lines in the shared document, following the template.

## Option A — your final project (if the team is already formed)

Take the requirements for your project (description, personas, stories — whatever you have) and make a *sketch* following the template. Don't aim for completeness: one entity with states, one decision with an alternative, one risk with a trigger — but every item with a reference to a requirement.

## Option B — extending DevMatch (if the teams are mixed)

Each room gets one "non-obvious persona" from `docs/project_context.md` and answers: what would change in the DevMatch architecture if we added it in the next version?

| Room | Persona / feature | Hint on where to start |
|---|---|---|
| 1 | **Mentor** — doesn't write code, 1–2 h/week, reviews decisions | is this a new role in the project or a new entity? how do they "join"? |
| 2 | **Course instructor** — 100+ students in 15–20 teams, nobody must be left without a team | what is a "course" in the model? where does the student list come from? what do they see? |
| 3 | **Moderator** — approves cards before publication | which state appears between DRAFT and PUBLISHED? who has the right? what about already published ones? |
| 4 | **Telegram notifications** about the decision on an application (post-MVP story) | this is already an integration, not a link: a bot, chat_id, what if Telegram is unavailable? |
| 5 | **Student from another major** (designer/PM) — roles are not only technical | does the Role model change? the catalog filter? tags? |

## Answer template

```
Persona / project: ...

1. Entities and states
   - new or changed entity: ... (states: ... → ...)   [requirement: ...]
2. Components
   - what is added / changed in the API, web, DB: ...        [requirement: ...]
3. Decision (ADR-lite)
   - decision: ...
   - rejected alternative: ... — because ...             [constraint: ...]
4. Risk
   - risk: ... · trigger (how we will notice): ... · mitigation: ... (where it lives: ...)
5. Open question for the course owner
   - ...
```

## Prompt you can use

```text
Context: [paste the project / persona description or a link to docs/].
Team constraints: [size, deadline, stack, budget].

Make an architecture sketch for [the persona / feature]:
1) which entities are added or changed, with their states and transitions;
2) which components (API, frontend, DB) this affects;
3) one key technical decision — 2 options with trade-offs for OUR team and a recommendation;
4) one risk with a trigger (how we will notice it has fired) and a mitigation;
5) one question that must be asked to the course owner before implementation starts.
Every item — with a reference to a requirement or constraint. If a requirement is missing — say so, don't invent it.
```

## Share-out (1 min per room)

One entity/state, one decision with a rejected alternative, one risk with a trigger. The speaker comments in one sentence: what of this will go into an ADR, and what is a question for the course owner.
