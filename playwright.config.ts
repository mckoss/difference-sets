import { defineConfig, devices } from '@playwright/test';

const baseURL = 'http://127.0.0.1:4173/difference-sets/';

export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL, ...devices['Desktop Chrome'] },
  webServer: {
    command: 'node tests/e2e/serve.mjs 4173',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
});
