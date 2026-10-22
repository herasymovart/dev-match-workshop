# Step 5 — Project skeleton

**Goal:** turn the documents into an *empty but working* structure, so that the next workshop starts with `pnpm install && pnpm dev` rather than with setup.
**Boundary:** no business logic whatsoever. Only structure, configs, DB schema, shared validations with tests, page stubs. Everything here must follow from the documents of steps 2–3.

**What to show students:**
- the AI generates the skeleton from *our* ADRs, not from its own idea of a "typical project";
- tests on the shared schemas — the first bridge between Gherkin and code: a rule from US-01 becomes `expect(...)`;
- verifying the result — `pnpm typecheck && pnpm test` — is mandatory; "looks right" doesn't count.

---

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

---

**After the result, pay attention to:**
- `git diff --stat step-04 step-05` — ~40 files, but not a single line of business logic. This is normal.
- Open `packages/shared/src/__tests__/validation.test.ts` — show the test names with scenario numbers.
- Open `apps/api/prisma/schema.prisma` next to `docs/architecture/data-model.md` — they must match 1:1. If not — the question is which to trust, and the answer is: the document, because people have read it.
