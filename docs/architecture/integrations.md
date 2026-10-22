# DevMatch — external dependencies

Main conclusion: **there is not a single API integration in the MVP.** Everything that looks like an integration in the requirements is a link or a format.

| Dependency | What exactly we take | Type | Validation / contract | If unavailable |
|---|---|---|---|---|
| **Telegram** | the user's username → link `https://t.me/<nick>` (US-14 AC) | link | format: 5–32 characters `[A-Za-z0-9_]`, `@` optional (US-01 AC); we do not check that the account exists | nothing breaks: the link simply will not open for the user |
| **GitHub** | the candidate's profile URL (US-12 AC) | link | `URL` is parsed, `hostname ∈ {github.com, www.github.com}`, https protocol (US-12 sc.2); we do not check that the profile exists | same |
| **PaaS (Render / Railway)** | Node process + persistent disk + domain | infrastructure | a health endpoint for checking; environment variables from `.env.example` | the demo does not work → local run as the fallback (`pnpm dev`), README |
| **SQLite** | DB file on disk | library (via Prisma) | — | — |
| **npm registry** | dependencies | build-time | `pnpm-lock.yaml` in the repo | — |

## What we consciously do not do in the MVP (and why it matters for the architecture)

| Possible integration | Why | Why not now | What would change |
|---|---|---|---|
| Telegram Bot API — notifications about the decision | post-MVP story "Notification about the result" | requires a bot, linking a chat_id to the user (a separate flow), webhook/polling | a new `notifications` component + a `TelegramLink` table; `services/applications` publishes an event after the transaction |
| GitHub API — profile check, number of repositories | "a clear picture of the candidate's level" (VPC) | rate limit without a token is 60 req/h; an unreliable signal | asynchronous enrichment of the application; not on the critical path |
| OAuth (GitHub / Google / Telegram Login) | convenient sign-in | ADR-0006: secrets and callbacks complicate the start | a second sign-in method; `User` gets `githubId`/`googleId`, the model does not change |
| Email (Resend/SendGrid) — password recovery | auth completeness | out of MVP scope | `services/auth` + an email template |

Rule: any new external dependency goes through an ADR, with a row in this table saying "if unavailable".
