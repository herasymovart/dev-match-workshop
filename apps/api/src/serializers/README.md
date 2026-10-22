# serializers/

Prisma record → DTO from `@devmatch/shared` (`docs/architecture/api.md` → DTO).

Why a separate layer: the same record is shown differently depending on who asks. A `Project` for the public never includes the owner's telegram; an `Application` for the owner includes the applicant's telegram only when APPROVED; the student's own application includes `leadTelegram` only when APPROVED (US-14 sc.2 — the field must be *absent*, not null).

Never `res.json(prismaObject)`.
