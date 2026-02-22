import { defineConfig, devices } from '@playwright/test';

const isCoverageRun = process.env['PLAYWRIGHT_COVERAGE'] === '1';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: !isCoverageRun,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: isCoverageRun ? 1 : process.env['CI'] ? 1 : undefined,
  timeout: isCoverageRun ? 90_000 : 30_000,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4200',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: {
    command: 'npm run start -- --host 127.0.0.1 --port 4200',
    url: 'http://127.0.0.1:4200',
    reuseExistingServer: true,
    timeout: 120_000
  }
});
