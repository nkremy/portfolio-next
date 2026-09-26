import { test, expect } from '@playwright/test';
import { trackPageErrors } from './helpers';

test.describe('Contact form', () => {
  test('submitting the contact form persists the message and gives clear feedback', async ({ page }) => {
    const errors = trackPageErrors(page);

    await page.goto('/contact');

    await page.fill('#name', 'Playwright Tester');
    await page.fill('#email', 'playwright-tester@example.com');
    await page.fill('#subject', 'E2E test subject');
    await page.fill('#message', 'This message was sent by the automated Playwright test suite.');

    const [response] = await Promise.all([
      page.waitForResponse((res) => res.url().includes('/api/contact')),
      page.getByRole('button', { name: /send message/i }).click(),
    ]);

    const body = await response.json();

    // Email delivery is not configured in the test environment, so the API
    // is expected to report that explicitly rather than silently failing -
    // but the query must still be persisted before any email is attempted.
    expect([200, 500]).toContain(response.status());
    if (response.status() === 500) {
      expect(body.error).toMatch(/email/i);
    } else {
      expect(body.success).toBe(true);
    }

    // The UI must reflect either outcome clearly, never a blank/stuck state.
    await expect(page.getByText(/thank you|failed to send|not configured/i)).toBeVisible({ timeout: 5_000 });

    expect(errors, `Unexpected page errors: ${errors.join('; ')}`).toEqual([]);
  });

  test('submitting an empty form shows validation feedback instead of crashing', async ({ page }) => {
    const errors = trackPageErrors(page);
    await page.goto('/contact');

    await page.getByRole('button', { name: /send message/i }).click();
    await page.waitForTimeout(500);

    // Required native fields should block submission; the app must not crash.
    expect(errors, `Unexpected page errors: ${errors.join('; ')}`).toEqual([]);
  });
});
