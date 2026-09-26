import { test, expect } from '@playwright/test';
import { trackPageErrors, TEST_ADMIN } from './helpers';

test.describe('Authentication', () => {
  test('unauthenticated visitor is kept out of /dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL((url) => !url.pathname.startsWith('/dashboard'), { timeout: 10_000 });
    expect(page.url()).not.toContain('/dashboard');
  });

  test('sign up creates the first (admin) account', async ({ page }) => {
    const errors = trackPageErrors(page);
    await page.goto('/auth/signup');

    await page.fill('#name', TEST_ADMIN.name);
    await page.fill('#email', TEST_ADMIN.email);
    await page.fill('#password', TEST_ADMIN.password);
    await page.fill('#confirmPassword', TEST_ADMIN.password);

    await page.getByRole('button', { name: /sign up|create account/i }).click();

    // Successful signup either redirects to signin or logs straight in.
    await page.waitForURL((url) => url.pathname === '/auth/signin' || url.pathname === '/dashboard', {
      timeout: 15_000,
    });

    expect(errors, `Unexpected page errors: ${errors.join('; ')}`).toEqual([]);
  });

  test('sign in with the wrong password shows an error and does not crash', async ({ page }) => {
    const errors = trackPageErrors(page);
    await page.goto('/auth/signin');

    await page.fill('#email', TEST_ADMIN.email);
    await page.fill('#password', 'not-the-right-password');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page.getByText(/invalid email or password/i)).toBeVisible({ timeout: 10_000 });
    expect(page.url()).toContain('/auth/signin');

    expect(errors, `Unexpected page errors: ${errors.join('; ')}`).toEqual([]);
  });

  test('sign in with the correct credentials reaches the dashboard', async ({ page }) => {
    const errors = trackPageErrors(page);
    await page.goto('/auth/signin');

    await page.fill('#email', TEST_ADMIN.email);
    await page.fill('#password', TEST_ADMIN.password);
    await page.getByRole('button', { name: /sign in/i }).click();

    await page.waitForURL('**/dashboard', { timeout: 15_000 });
    expect(page.url()).toContain('/dashboard');

    expect(errors, `Unexpected page errors: ${errors.join('; ')}`).toEqual([]);
  });
});
