import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: 'list',
  globalSetup: require.resolve('./tests/global-setup.ts'),
  globalTeardown: require.resolve('./tests/global-teardown.ts'),
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: `npm run dev -- --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 60_000,
    env: {
      DATABASE_URL: 'mongodb://localhost:27017/portfolio_test?replicaSet=rs0',
      NEXTAUTH_SECRET: 'e2e-test-secret-not-for-production',
      NEXTAUTH_URL: BASE_URL,
      ENABLE_SIGNUP: 'true',
      ADMIN_EMAIL: '',
      // Force-disabled so the contact form deterministically reports
      // "not configured" instead of attempting a real SMTP connection.
      EMAIL_HOST: '',
      EMAIL_PORT: '',
      EMAIL_USER: '',
      EMAIL_USER_PASS: '',
      EMAIL_RECEIVER: '',
      EMAIL_RECEIVER_PASS: '',
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'dsc2xiudm',
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
      CLOUDINARY_FOLDER: process.env.CLOUDINARY_FOLDER || 'portfolio-e2e',
    },
  },
});
