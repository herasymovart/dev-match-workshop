# DevMatch decision and options map

**What this is:** a comparison of options for every decision that has to be made *before* coding starts. There are no choices here yet — only options, criteria and what tips the scales. The choice and its rationale are in `docs/adr/`.
**Sources:** `requirements-digest.md` (what is required), `project_context.md` (who the user is), team constraints (below).

## Constraints against which everything is evaluated

| # | Constraint | Source |
|---|---|---|
| K1 | Team of 3–4 students, basic TS/React/Node, no DevOps | course |
| K2 | 6–8 weeks in parallel with other courses | course |
| K3 | Stack: TypeScript only, React / React Native, Node.js | course |
| K4 | 0 UAH for infrastructure | course |
| K5 | Local run with one command after clone | course + working with Claude Code |
| K6 | Public project links are shared in chats, catalog without registration | US-04, US-09 |
| K7 | Exact HTTP codes and atomicity of counters are part of the requirements | US-05, US-06, US-08, US-11, US-12 |
| K8 | Hundreds of users, not thousands; one semester | digest A4 |

Scale in the tables: **+** good for us · **0** neutral · **−** bad for us. The rating is *for this team*, not "in general".

---

## 1. Application architecture style

Question: how to organize the code inside the backend and frontend so that 4 people do not get in each other's way and so that the business rules (R1–R18) have one home.

| Option | Essence | K1 simplicity | K2 speed | Where business rules live | Testability of rules | When appropriate |
|---|---|---|---|---|---|---|
| **A. Layered / "MVC for API"** | routes (controller) → services → data access; models = Prisma | + | + | services | + (a service is tested without HTTP) | small teams, CRUD + a few rules — **our case** |
| B. "Fat controllers" (everything in the route handler) | validation, rules, DB queries in one handler | + | + at first, − later | smeared around | − (only through HTTP) | a weekend prototype |
| C. Clean / Hexagonal (ports & adapters) | domain → use cases → adapters; interfaces for DB and HTTP | − | − | use cases | ++ | when the DB/transport changes or the domain is complex |
| D. Modular monolith (feature modules) | modules `projects/`, `applications/`, each with its own routes+service+repo | 0 | 0 | in the module | + | 6+ modules, several teams |
| E. Microservices | separate services for catalog, applications, auth | −− | −− | distributed | − (integration) | dozens of developers; not for K1/K2/K8 |

For the frontend separately:

| Option | Essence | Rating |
|---|---|---|
| **A. Pages + hooks + server-state library** | page component → hook `useProject(id)` → TanStack Query → api-client; minimal local state | + : server data is the single source of truth, cache and invalidation for free |
| B. MVVM / global store (Redux, MobX, Zustand) | ViewModel/store holds a copy of server data | 0 : an extra layer for a CRUD app, duplicates server state; appropriate for complex local state (editors, canvas) |
| C. Components with `useEffect` + `fetch` | each component calls the API itself | − : duplication, manual loading states, desync after mutations (US-06 → list and counter) |

**What tips the scales:** K1, K2, K7. A layered structure gives one place for R1–R18 without infrastructural complexity; `services/applications` becomes the sole owner of the counter (K7). Clean/Hexagonal is the right answer to a question we do not have (changing the DB/transport). **What would change the choice:** if the domain had 10+ entities with complex rules or two teams — D.

→ ADR-0009 (style), ADR-0004 (backend layers), ADR-0003 (frontend)

---

## 2. Client platform

| Option | K3 | K6 link sharing | K2 deadline | K1 team | Comment |
|---|---|---|---|---|---|
| **A. Web SPA (React)** | + | + opens from the chat right away | + | + | responsive layout covers the phone |
| B. React Native (Expo) | + | − the link leads to the store / Expo Go | − publishing to stores | 0 | push is the only advantage, and it is post-MVP |
| C. Web + RN | + | + | −− | −− | two codebases |
| D. PWA (web + manifest) | + | + | 0 | 0 | a cheap addition to A later, not a separate decision |

**What tips the scales:** K6 — the main scenario is "copied a link into a chat". **What would change the choice:** a push-notification requirement in the MVP.
→ ADR-0001

---

## 3. Frontend tooling

| Decision | Options | Rating for us |
|---|---|---|
| Build | **Vite** / Next.js / CRA | Vite + : zero configuration, fast. Next − : SSR/SEO not needed (K8), App Router is an unnecessary learning curve for K1. CRA — unmaintained |
| Routing | **React Router** / TanStack Router / file-based (Next) | React Router + : 8 pages, the most learning material |
| Server data | **TanStack Query** / SWR / Redux Toolkit Query / manual | TanStack Query + : invalidation after mutations (US-05/06/07) without manual state; SWR — ok, fewer capabilities; RTK Query — drags in Redux |
| Forms | **react-hook-form + zod** / manual / Formik | RHF + : the same zod schemas from `shared` (K7, identical validation); manual — ok for 4 forms, but duplicates the rules |
| Styles | **CSS Modules** / Tailwind / UI kit (MUI, shadcn) | CSS Modules + : zero dependencies; Tailwind 0 : fast, but one more language; UI kit 0 : quick look, harder to customize — can be added later without an ADR |

→ ADR-0003

---

## 4. Backend tooling and API style

| Decision | Options | Rating for us |
|---|---|---|
| Framework | **Express 5** / Fastify / NestJS / Hono / serverless functions | Express + : familiar (K1), async errors out of the box in v5. Fastify 0 : better typing and speed, new plugin model. NestJS − : DI/decorators — a week to learn (K2). Hono 0 : modern, little material for students. Serverless − : transactions and SQLite do not get along, cold start, more complicated local run (K5) |
| Validation | **zod in shared** / Joi / class-validator / JSON Schema | zod + : one schema for the form and the API (K7); the others do not share with the frontend as naturally |
| API style | **REST/JSON** / GraphQL / tRPC | REST + : the requirements are formulated in HTTP codes (K7), visible in DevTools. GraphQL − : unnecessary complexity for 14 operations, error codes get hidden. tRPC 0 : end-to-end types are attractive, but it hides HTTP codes and ties the client |
| Error format | **`{error:{code,message,details}}`** / RFC 7807 Problem Details / string | own format + : simple, codes from Gherkin; RFC 7807 0 : a standard, but more fields than needed |

→ ADR-0004

---

## 5. Data store

| Option | K4 free | K5 one-command run | Transactions (K7) | Enum/constraints | Growth path | Comment |
|---|---|---|---|---|---|---|
| **A. SQLite + Prisma** | + | + a file | + | − no enum in Prisma on SQLite | → PostgreSQL by changing the provider | one instance (K8 ok) |
| B. PostgreSQL (Docker locally, Neon/Supabase in prod) | + with limitations | 0 Docker for everyone | + | + | + | free tier goes to sleep; keys from day one |
| C. MongoDB (Atlas) | + | 0 | 0 transactions exist, but the model is relational (4 FKs) | − | 0 | the document model does not help: the data is tabular |
| D. Supabase as BaaS (DB + auth + API) | + | − depends on the cloud | 0 | + | 0 | takes away from the team exactly what it is supposed to learn (API, transactions) |
| ORM: **Prisma** / Drizzle / Kysely / raw SQL | — | — | — | — | — | Prisma + : schema=documentation, migrations, the most material; Drizzle 0 : lighter, closer to SQL; raw − : manual migrations |

**What tips the scales:** K5 and K4. **What would change the choice:** >1 instance or a need for a partial unique index — B.
→ ADR-0005

---

## 6. Authentication

A gap from the digest (question 1): the requirements need identity but do not describe sign-in.

| Option | External dependencies | Effort (K2) | Covers US-01 (Telegram) | Covers GitHub for US-12 | Risks | Comment |
|---|---|---|---|---|---|---|
| **A. Email + password, cookie sessions** | none | low | via onboarding | in the application form | password storage (bcrypt), no recovery in the MVP | works offline at the demo |
| B. GitHub OAuth | OAuth App, secrets | medium | via onboarding | + automatically | callback URL for every environment; the demo depends on GitHub | a good *second* method after the MVP |
| C. Telegram Login Widget | bot + public domain | medium | + automatically | in the form | does not work on localhost without a tunnel | |
| D. Magic link via email | email provider | medium | via onboarding | in the form | email delivery, free tier | |
| E. No auth, identity = Telegram username | none | zero | — | — | anyone can impersonate anyone; violates US-05 sc.3, US-14 sc.2 | unacceptable |
| Sessions: **cookie (httpOnly) + Session table** / JWT | — | — | — | — | JWT: not revocable, stored on the client; cookie + one origin (ADR-0008) — no CSRF headache | |

**What tips the scales:** K4, K5, a demo without network dependencies. **What would change the choice:** a "sign-in via GitHub/university account" requirement from the course owner — B, the User model does not change.
→ ADR-0006

---

## 7. Integrations

| Potential integration | Why (from the requirements) | Options | For the MVP |
|---|---|---|---|
| Telegram | contact after approval (US-14) | **link `t.me/<nick>`** / Bot API for notifications / Login Widget | link. A bot — when there is a "Notifications" story (post-MVP) |
| GitHub | "assess the candidate's level" (US-05) | **URL with domain validation** / GitHub API (repositories, activity) | URL. API — rate limit 60/hour without a token, unreliable signal |
| Email | notifications, password recovery | Resend / SendGrid / nothing | nothing; post-MVP |
| Hosting | public link (K6) | **Render / Railway (one process)** / Vercel + Render / Fly.io / VPS | one process, see §8 |

**Conclusion:** the MVP has no API integrations at all; everything is formats and links. This is a *decision* worth recording, because "add a bot" is the most common scope creep.
→ `docs/architecture/integrations.md`

---

## 8. Deployment

| Option | K4 | K1 DevOps | Cookie sessions (one origin?) | Comment |
|---|---|---|---|---|
| **A. One process: Express serves the SPA + /api** on Render/Railway | + | + | + one origin | free tier goes to sleep — a known risk |
| B. Vercel (web) + Render (api) | + | 0 | − two origins: CORS, SameSite=None | two configurations that get mixed up |
| C. Fly.io with a volume | + limited | 0 | + | a bit more CLI |
| D. VPS + Docker Compose | − | − | + | no free VPS |

→ ADR-0008

---

## Summary: what we record in ADRs

| Decision | Leans towards | Main criterion | ADR |
|---|---|---|---|
| Architecture style | layered structure in a monolith; frontend — pages + hooks + server-state | K1, K7 | 0009 |
| Platform | Web SPA | K6 | 0001 |
| Repository | pnpm monorepo | K7 (shared schemas) | 0002 |
| Frontend | Vite, React Router, TanStack Query, CSS Modules | K1, K2 | 0003 |
| Backend | Express 5, zod, REST, single error format | K1, K7 | 0004 |
| Data | Prisma + SQLite → PostgreSQL | K4, K5 | 0005 |
| Auth | email + password, cookie sessions | K4, K5 | 0006 |
| Concurrency | conditional UPDATE in a transaction | K7 | 0007 |
| Deployment | one process on a free PaaS | K4, K1 | 0008 |

Decisions we are **not** making now: UI kit/Tailwind (does not affect the architecture), forms library (can be decided on the first form).
