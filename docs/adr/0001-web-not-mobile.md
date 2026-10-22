# ADR-0001: Web application (React), not React Native

**Status:** accepted
**Date:** 2026-10-22

## Context
The stack is limited to React or React Native. We need to choose a platform based on the user journey (`docs/project_context.md`) and the requirements US-04, US-09.

Key facts from the requirements:
- the project lead "copies a short link for the student chat" (Journey 1, step 3; US-04 AC "available via a public link");
- the catalog and the project page are accessible **without registration** (US-09 AC);
- the audience is students who live in Telegram on laptops and phones; no scenario needs a camera, push or offline.

## Options
### A. Web (React SPA)
+ the link opens right away, without installation; works on the phone through the browser
+ one deployment artifact, free hosting
+ the lowest barrier for the team and for Claude Code (fast "changed — saw it" cycle)
− no push notifications (they are post-MVP anyway)

### B. React Native (Expo)
+ a "real" mobile experience, push
− a link from a chat leads to the store/Expo Go — breaks the main sharing scenario
− publishing to stores does not fit into 6–8 weeks; testing on 2 platforms
− web is still needed for the public catalog without installation

### C. Web now + RN later
+ does not close the door
− two codebases for a team of 3–4 people — unrealistic within the deadline

## Decision
**A — Web.** The platform follows from the link-sharing and public-catalog requirements, not from taste. Responsive layout covers mobile viewing.

## Consequences
+ one codebase, fast deployment, simple team onboarding
− push and native capabilities are unavailable; notifications (post-MVP) should be done via email or a Telegram bot, not via push
Revisit: if after the MVP a requirement for "in-the-pocket" notifications appears — an ADR about a Telegram bot, not about RN.

## Related stories
US-04, US-09, US-11
