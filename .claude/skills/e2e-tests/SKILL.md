---
name: e2e-tests
description: Write a Playwright end-to-end spec for a DevMatch user journey that spans several user stories (e.g. lead creates and publishes a project, student applies, lead approves). Seeds data through the API, locates elements by role, follows the e2e rules in docs/architecture/testing.md. Use when asked for an e2e, browser, journey or Playwright test.
argument-hint: journey name or list of stories, e.g. "student-applies" or "US-09 US-11 US-12 US-13"
---

Write an end-to-end test for `$ARGUMENTS` following the "End-to-end rules" in `docs/architecture/testing.md`.

## 1. Define the journey

- Map `$ARGUMENTS` to stories and their Gherkin scenarios in `docs/US-*.md`. An e2e spec covers the **happy path** of the journey plus at most one or two user-visible error paths that only the browser can show (e.g. the disabled Apply button on a filled role). Validation messages and status codes belong to unit/API tests — do not duplicate them here.
- Read `docs/architecture/overview.md` (routes → stories) and the pages involved in `apps/web/src/pages`. Check `e2e/` for existing specs and helpers.

## 2. Plan (show, then continue)

Steps of the journey as the user would describe them, each with: the page, the action (by role/name), the visible result. Mark which steps are **seeded via the API** (`request` fixture or helpers in `e2e/helpers/`) instead of clicked through — anything the journey is not about.

## 3. Write `e2e/<journey>.spec.ts`

- One `test()` for the happy path; `test.describe` for the journey; optional error-path tests in the same file.
- Locators: `getByRole`, `getByLabel`, `getByText` with exact user-facing strings from the code. Never CSS classes or test ids unless no accessible name exists (then add an accessible name to the component instead).
- Web-first assertions only (`await expect(locator).toBeVisible()`); no `waitForTimeout`.
- Two actors (lead and student) → two `browser.newContext()` sessions in the same test, logged in through the real UI or the API.
- Data created by the test should be unique per run (suffix with `Date.now()`) so the spec is re-runnable against the same dev DB.

## 4. Run and report

`pnpm test:e2e -- <spec>`, then the whole `pnpm test:e2e`. If browsers are missing, run `pnpm exec playwright install chromium` once. Report the journey steps with pass/fail, and list any UI gap you found (missing accessible name, missing page) as a finding, not as something you silently worked around.
