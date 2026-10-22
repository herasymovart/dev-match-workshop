# DevMatch requirements analysis (digest for design)

Sources: `docs/project_context.md`, `docs/US-INIT-1.md` (US-01…US-08), `docs/US-STUD-1.md` (US-09…US-14).
This is analysis, not design: there are no technologies or decisions here, only what *follows from the text of the requirements* and what is missing from it.

---

## 1. Entities and their states

### 1.1 User

The requirements have no separate story about the user, but mention one in every story as "project lead", "student", "project author", "current user".

| Attribute | Source | Constraints |
|---|---|---|
| Telegram username | US-01 AC, US-12 AC | 5–32 characters, `[A-Za-z0-9_]`, leading `@` is optional and normalized to `@name` (US-01 sc.1) |
| Name / display username | US-05 AC ("candidate's name/username"), US-11 AC ("author's username") | not specified |
| GitHub link | US-12 AC | submitted *in the application form*, not in the profile |

There are no states. The "lead" and "student" roles are not user types but **roles relative to a project**: the same user can create one project and apply to another. The requirements do not say this directly, but nothing contradicts it (see §4, question 2).

### 1.2 Project

| Attribute | Source | Constraints |
|---|---|---|
| Title | US-02 AC | required, 5–100 characters |
| Idea description | US-02 AC | required, 30–1000 characters; in the catalog — an excerpt of up to 150 characters (US-09 AC) |
| Overall stack (tags) | US-02 AC | 1–10 tags; search is case-insensitive (US-10 AC) |
| Owner (Project Lead) | US-02 AC | the author automatically becomes the owner |
| Status | US-02, US-04, US-08 | `DRAFT` → `PUBLISHED` → `CLOSED` |
| `published_at` | US-04 AC | set at publication; catalog sorted `DESC` (US-09 AC) |
| Creation date | US-11 AC | displayed on the page |

**Transitions:**

| From | To | Who | Condition | Source |
|---|---|---|---|---|
| — | `DRAFT` | owner | valid form | US-02 sc.1 |
| `DRAFT` | `PUBLISHED` | owner | ≥ 1 role in the project | US-04 AC, sc.2 |
| `PUBLISHED` | `CLOSED` | owner | confirmation in a modal dialog | US-08 sc.1 |

There are no reverse transitions (`CLOSED` → `PUBLISHED`, `PUBLISHED` → `DRAFT`) in the requirements. Editing and deletion are post-MVP (`project_context.md`, story map).

### 1.3 Role (open role)

| Attribute | Source | Constraints |
|---|---|---|
| Role name | US-03 AC | up to 50 characters, from a list or free text; unique within the project (US-03 sc.3) |
| `total_spots` | US-03 AC | integer, 1–5 |
| `available_spots` | US-03 AC | on creation `= total_spots`; decremented by 1 on approval (US-06 AC) |
| Status | US-06 AC | `OPEN` → `FILLED` when `available_spots == 0` |

**Transitions:**

| From | To | Who | Condition | Source |
|---|---|---|---|---|
| — | `OPEN` | project owner | project is in `DRAFT` or `PUBLISHED` | US-03 AC |
| `OPEN` | `FILLED` | system | approving an application brought `available_spots` to 0 | US-06 sc.2 |

There is no `FILLED` → `OPEN` transition (removing someone from the team is "a separate manual arrangement", US-07 AC).

### 1.4 Application

| Attribute | Source | Constraints |
|---|---|---|
| Role (`roleId`) | US-12 AC | an application is tied to a specific open role, not to the project |
| Candidate's Telegram | US-12 AC | same rules as in US-01 |
| GitHub URL | US-12 AC | valid URL, domain `github.com` (sc.2: gitlab.com is rejected) |
| Comment | US-12 AC | optional, up to 300 characters |
| Status | US-12, US-06, US-07 | `PENDING` → `APPROVED` \| `REJECTED` |
| Submission date | US-05 AC, US-13 AC | sorted "newest first" |

**Transitions:**

| From | To | Who | Condition | Source |
|---|---|---|---|---|
| — | `PENDING` | student | project `PUBLISHED`, role `OPEN`, no active application by the same user for this role | US-12 AC, sc.3, sc.4; US-08 sc.2 |
| `PENDING` | `APPROVED` | project owner | `available_spots > 0` at the moment of approval | US-06 AC, sc.3 |
| `PENDING` | `REJECTED` | project owner | — | US-07 AC |

`APPROVED` and `REJECTED` are terminal (US-06 AC last item, US-07 sc.2).

---

## 2. Business rules and invariants

| # | Rule | Source |
|---|---|---|
| R1 | A `DRAFT` project is visible to no one except the owner | US-02 AC, US-09 sc.3 |
| R2 | Publishing is possible only with ≥ 1 role | US-04 sc.2 |
| R3 | The catalog contains only `PUBLISHED` projects, sorted by `published_at DESC` | US-09 AC |
| R4 | The catalog and the project page are accessible without authorization | US-09 AC |
| R5 | The project author's Telegram is **never** returned in public responses; only to the author of an approved application | US-11 AC, US-14 AC + sc.2 ("not passed in the JSON") |
| R6 | The project's application list is visible only to the owner; others get 403 | US-05 sc.3 |
| R7 | Approval: `available_spots -= 1`; if it reaches 0 — the role becomes `FILLED` | US-06 AC |
| R8 | Approval is impossible if `available_spots == 0` — even if it was 1 a second ago | US-06 sc.3 |
| R9 | Rejection does not change the counter | US-07 AC |
| R10 | Processing an already processed application again — "already processed" error | US-06 AC, US-07 sc.2 |
| R11 | One user — one active (`PENDING`/`APPROVED`) application per role | US-12 sc.3 |
| R12 | Applying for a role with 0 spots → 409; to a `CLOSED` project → 400 | US-12 sc.4, US-08 sc.2 |
| R13 | After `CLOSED`, new applications are forbidden; existing `PENDING` ones remain visible to the owner | US-08 AC |
| R14 | Role name is unique within the project | US-03 sc.3 |
| R15 | Roles can be added only in `DRAFT`/`PUBLISHED` and only by the owner | US-03 AC |
| R16 | After approval the lead sees the student's Telegram; the student sees the lead's Telegram | US-06 AC, US-14 AC |
| R17 | Non-existent project → 404 | US-11 sc.2 |
| R18 | Tag filter is case-insensitive, exact tag match | US-10 AC, sc.1 |

---

## 3. Non-functional requirements that follow from the text

| Requirement | Where it follows from | Design consequence |
|---|---|---|
| **Access control on the backend**, not only in the UI | US-05 sc.3 (direct link), US-08 sc.2 ("API request"), US-14 sc.2 ("direct request to the API") | every endpoint checks owner/status independently of the UI |
| **Atomicity of approval** | US-06 sc.3 (race condition), US-12 sc.4 (409 Conflict) | application status change + counter decrement + role status change — one transaction with a condition check |
| **Filtering of response fields by the requester's role** | US-14 AC ("at the API backend level") | DTO/serialization depends on who is asking |
| **Public read access** | US-09 AC | part of the API without authentication; be careful about what exactly is public (R5) |
| **Validation on both levels** | all "Validation error" scenarios show a message in the UI; US-08 sc.2 requires an error from the server | the same validation rules in the form and in the API; messages in English, translated from the acceptance-criteria texts (the AC are Ukrainian) |
| **Exact error codes** | 400, 403, 404, 409 are named explicitly | the error dictionary is part of the API contract |
| **Idempotency of status changes** | US-07 sc.2 | a repeated request does not break the state |

Explicitly **not** required: notifications (post-MVP), real-time updates, scaling, i18n (all texts are in English).

---

## 4. Gaps and open questions

| # | Question | Why it blocks | Cheapest answer for the MVP |
|---|---|---|---|
| 1 | **How does a user authenticate?** US-01 says "signed in for the first time", US-13 — "the current user's applications", but no story describes registration/sign-in. US-12 asks for Telegram and GitHub in the *application form*, as if there were no profile. | Without identity, R6, R11, R16, US-13 are impossible. | Minimal authentication (email + password or one external provider); Telegram in the profile (US-01) *and* pre-filled in the application form (US-12) — both stories are satisfied. |
| 2 | Can one user be both a lead and a student? | Affects the User model (one entity or two) and navigation. | Yes, one User entity; "lead" = owner of ≥ 1 project. Low risk. |
| 3 | Can the owner apply to their own project? | R11 and counters; UI button. | Forbid on the backend (one line). Low risk. |
| 4 | Student identity in R11: "by Telegram username" (US-12 sc.3) or by account? | If by username — duplicates can be bypassed by changing case/`@`. | By user account; Telegram is a normalized contact. |
| 5 | What does the student see on the "application view page" (US-14 sc.1)? A separate page or a card in the US-13 list? | Number of pages/endpoints. | The card in the "My applications" list expands; no separate endpoint is needed. |
| 6 | Can the owner add roles after `CLOSED`? US-03 AC only says `DRAFT`/`PUBLISHED`. | Status logic. | No. Already follows from the AC; we state it explicitly. |
| 7 | Stack tags — free text or a dictionary? US-10 mentions "a list of popular technologies *or* typing". | Tag data model, filter quality. | Free text, normalized to lower case; "popular" = top by frequency. |
| 8 | "Candidate's name/username" (US-05) — where does it come from if the profile is minimal? | User fields. | Display name at registration; by default — Telegram without `@`. |
| 9 | How many applications can a student have in total / per project for different roles? | Anti-spam. | No limits in the MVP except R11. Medium risk (spam) — see §5. |
| 10 | What happens to `PENDING` applications for a role that became `FILLED`? | Student UX, R8. | They remain `PENDING`; their approval is blocked by R8; auto-rejection is post-MVP. |

---

## 5. Assumptions for the MVP

| # | Assumption | Risk if wrong | Comment |
|---|---|---|---|
| A1 | One User entity; the "lead/student" roles are contextual | low | simplifies the model and navigation |
| A2 | Minimal authentication without external providers | medium | if the instructor requires "sign-in via university account" — a provider will have to be added; the model does not change |
| A3 | All texts in English, no i18n | low | error texts are English translations of the acceptance-criteria texts (the AC are Ukrainian) |
| A4 | One server instance, small load (hundreds of users, not thousands) | low for a student project | affects the choice of data store; transactionality is still needed (R8) |
| A5 | Telegram and GitHub are links only, without calling their APIs | low | format validation; the profile's existence is not verified |
| A6 | Notifications, drafts with editing, auto-closing, team export — out of the MVP | low | explicitly marked post-MVP in the story map |
| A7 | The moderator (persona 6) and the instructor (persona 5) have no functions in the MVP | medium | if moderation becomes necessary — another project state (`PENDING_REVIEW`) appears between `DRAFT` and `PUBLISHED`; worth leaving room in the state machine |
