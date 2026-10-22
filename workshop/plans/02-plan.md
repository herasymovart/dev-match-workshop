# The plan Claude showed in plan mode (step 2) — saved copy

> This is what the plan looked like before approval. After "Yes, manually approve edits" Claude created `docs/analysis/options.md`, then `docs/adr/0001…0009` with `README.md`, then `docs/architecture/risks.md` and `integrations.md`.

## Clarifications Claude asked before the plan

1. Are several courses/instructors in the system expected in the MVP (affects the model and the rating of the modular monolith)? — **No**, one semester, personas 5–6 are outside the MVP (digest A7).
2. Does the team have experience with any ORM or DB? — **Basic SQL**, no ORM used before.

## Plan

**Result files, in order:** `docs/analysis/options.md` (the comparison), `docs/adr/0001…0009.md` + `docs/adr/README.md` (the decisions), `docs/architecture/risks.md` and `docs/architecture/integrations.md` (what the decisions carry). No other changes.

**Constraints we rate against (K1–K8):** a team of 3–4 students without DevOps; 6–8 weeks; TS/React/RN/Node stack; 0 UAH; one-command launch; public links in chats (US-04, US-09); exact HTTP codes and atomic counters (US-05/06/08/11/12); hundreds of users (A4).

**Order of decisions (from independent to dependent):**

1. Client platform (web / RN / both / PWA) — depends only on the K6 requirements.
2. Repository structure (mono / poly / single package) — depends on 1 and on the need to share validations (K7).
3. Application architecture style — backend: layered (routes→services→data), fat controllers, clean/hexagonal, modular monolith, microservices; frontend: pages+hooks+server-state, MVVM/global store, useEffect+fetch.
4. Frontend tools: build, routing, server data, forms, styles.
5. Backend tools and API style: framework, validation, REST/GraphQL/tRPC, error format.
6. Data store and ORM — depends on K4/K5 and on the transaction requirement (K7).
7. Authentication — closes the gap from the digest (question 1); depends on 6 (sessions) and on 8 (single origin).
8. Concurrency for the spot counter (US-06 sc.3, US-12 sc.4) — depends on 6.
9. Integrations (Telegram, GitHub, email, hosting) — what is an API integration and what is just a link.
10. Deployment — depends on 1, 6, 7.

**Format of each options section:** a table of options × criteria rated + / 0 / −; a row "what tips the choice"; a row "what would change the choice"; a reference to the future ADR. At the end: a summary table "decision → what it leans toward → main criterion → ADR number" and a list of decisions we consciously do *not* make now.

**ADRs:** one file per row of the summary table (nine), each with 2–3 options from options.md, the decision and its consequences; the README holds the index, the template and the rule for when an ADR is written.

**Risks:** derived from the consequences sections of the ADRs plus the digest's assumptions; three groups (technical, product, team); every risk with a trigger and the component or ADR it lives in; a separate list of risks accepted for the MVP. **Integrations:** one table of external dependencies with "if unavailable", and a table of integrations consciously *not* done in the MVP.

**Check:** every "−" must reference a specific K1–K8 constraint or a story; no option without at least one plus (otherwise it is not an option, but a straw man); every risk has a trigger that can be observed, not "we notice bugs".
