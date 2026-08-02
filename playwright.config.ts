import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,

  /* DEĞİŞİKLİK 1: Hem detaylı HTML raporu üretir hem de konsolda temiz bir liste sunar */
  reporter: [['html'], ['list']],

  /* Shared settings for all the projects below. */
  use: {
    /* DEĞİŞİKLİK 2: Test hata alırsa otomatik olarak ekran görüntüsü kaydeder */
    screenshot: 'only-on-failure',

    /* Collect trace when retrying the failed test. */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
