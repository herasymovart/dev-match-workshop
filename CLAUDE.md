# DevMatch

Team-matching service for student and hackathon projects. Leads publish project
cards with open roles; students browse, filter by stack and apply in one click.

## Status

Design phase. There is no code yet. All requirements live in `docs/`:

- `docs/project_context.md` — product description, personas, value canvases, user journeys, story map
- `docs/US-INIT-1.md` — user stories US-01..US-08 (project initiator), with acceptance criteria and Gherkin
- `docs/US-STUD-1.md` — user stories US-09..US-14 (student), with acceptance criteria and Gherkin

The three requirement files above are the original input and are written in Ukrainian.
Everything else in this repository (analysis, decisions, architecture, prompts, code, config)
is in English. User-facing strings are English translations of the acceptance-criteria texts.

## Constraints

- Stack is limited to TypeScript, React / React Native and Node.js.
- Team: 3–4 students, 6–8 weeks, zero infrastructure budget.
- Design artifacts go to `docs/analysis/`, `docs/adr/`, `docs/architecture/`.
- Do not invent requirements silently. If something is missing, say so and propose an assumption.
