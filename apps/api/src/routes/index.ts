import { Router } from 'express';

export const router = Router();

router.get('/health', (_req, res) => {
  res.json({ ok: true });
});

// Mount feature routers here as stories are implemented (see docs/architecture/api.md):
// router.use('/auth', authRouter);
// router.use('/me', meRouter);
// router.use('/projects', projectsRouter);
// router.use('/roles', rolesRouter);
// router.use('/applications', applicationsRouter);
