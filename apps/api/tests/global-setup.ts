import { execSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * Rebuilds prisma/test.db from schema.prisma before the test run (once).
 * The throwaway file is removed with fs and recreated by a plain `db push`, so no
 * destructive Prisma flag is ever needed (and nothing can point this at dev.db).
 */
export default function globalSetup() {
  const apiDir = fileURLToPath(new URL('..', import.meta.url));
  for (const suffix of ['', '-journal']) {
    rmSync(new URL(`../prisma/test.db${suffix}`, import.meta.url), { force: true });
  }
  execSync('pnpm exec prisma db push --skip-generate', {
    cwd: apiDir,
    env: { ...process.env, DATABASE_URL: 'file:./test.db' },
    stdio: 'pipe',
  });
}
