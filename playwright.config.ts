import { defineConfig, devices } from '@playwright/test';

const PORT = 4321;
const BASE = process.env.SITE_BASE ?? '/jenniferye-portfolio-website';

// Use a preinstalled Chrome when Playwright's own download isn't available.
const exe = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
const launchOptions = exe ? { executablePath: exe } : {};

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}${BASE}/`,
    trace: 'retain-on-failure',
    launchOptions,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], launchOptions } },
    {
      name: 'mobile',
      testIgnore: /responsive\.spec\.ts/,
      // Tests tagged @desktop need a mouse and a wide viewport.
      grepInvert: /@desktop/,
      use: { ...devices['Pixel 7'], launchOptions },
    },
  ],
  // Tests run against the production build, not the dev server.
  webServer: {
    command: `npx astro preview --port ${PORT} --ignore-lock`,
    url: `http://localhost:${PORT}${BASE}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
