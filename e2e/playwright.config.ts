import { defineConfig, devices } from '@playwright/test';

// Journeys only (docs/architecture/testing.md → "End-to-end rules").
// Starts both dev servers; needs apps/api/.env and a migrated dev.db.
export default defineConfig({
  testDir: '.',
  fullyParallel: false,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'pnpm --filter @devmatch/api dev',
      url: 'http://localhost:3000/api/health',
      reuseExistingServer: true,
      timeout: 30_000,
    },
    {
      command: 'pnpm --filter @devmatch/web dev',
      url: 'http://localhost:5173',
      reuseExistingServer: true,
      timeout: 30_000,
    },
  ],
});
