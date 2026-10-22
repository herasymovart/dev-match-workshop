import { defineConfig } from 'vitest/config';

// API tests run against a dedicated SQLite file (docs/architecture/testing.md → "Test database").
// global-setup rebuilds it from schema.prisma; files run serially because there is one DB file.
export default defineConfig({
  test: {
    globals: true,
    env: { DATABASE_URL: 'file:./test.db', NODE_ENV: 'test' },
    globalSetup: ['./tests/global-setup.ts'],
    fileParallelism: false,
    include: ['tests/**/*.test.ts', 'src/**/__tests__/**/*.test.ts'],
  },
});
