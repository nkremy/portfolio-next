import type { Page } from '@playwright/test';

export function trackPageErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (err) => {
    errors.push(err.message);
  });
  return errors;
}

export const TEST_ADMIN = {
  name: 'E2E Admin',
  email: 'e2e-admin@example.com',
  password: 'E2E-test-password-123',
};
