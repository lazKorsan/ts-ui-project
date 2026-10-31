import {defineConfig} from '@playwright/test';

export default defineConfig({
  testDir: './',
  testIgnore: ['**/node_modules/**', '**/playwright-report/**', '**/test-results/**'],
  testMatch: '**/*.spec.ts',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [['html'], ['list']],

  use: {
    // Sabit piksel boyutunu devre dışı bırakıyoruz
    viewport: null,
    headless: false,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: {

        // Doğrudan varsayılan Chromium/Chrome motorunu tam ekran parametresiyle başlatıyoruz:
        viewport: null,
        launchOptions: {
          args: ['--start-maximized'],
        },
      },
    },
  ],
});