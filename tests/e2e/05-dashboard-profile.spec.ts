import { test, expect } from '@playwright/test';
import { trackPageErrors, TEST_ADMIN } from './helpers';

async function loginAsAdmin(page: import('@playwright/test').Page) {
  await page.goto('/auth/signin');
  await page.fill('#email', TEST_ADMIN.email);
  await page.fill('#password', TEST_ADMIN.password);
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL('**/dashboard', { timeout: 15_000 });
}

test.describe('Dashboard profile edits reflect on the public site', () => {
  const uniqueSuffix = Date.now();
  const newBio = `E2E bio updated at ${uniqueSuffix}`;
  const newLocation = `E2E City ${uniqueSuffix}`;
  const newPhone = '+000000000';
  const newSkill = `E2E-Skill-${uniqueSuffix}`;

  test('editing the profile in the dashboard saves successfully', async ({ page }) => {
    const errors = trackPageErrors(page);
    await loginAsAdmin(page);

    await page.goto('/dashboard/profile');
    await page.getByRole('button', { name: /edit profile/i }).click();

    await expect(page.locator('#bio')).toBeVisible({ timeout: 10_000 });
    await page.fill('#bio', newBio);
    await page.fill('#location', newLocation);
    await page.fill('#phone', newPhone);
    await page.fill('#skills', newSkill);
    await page.press('#skills', 'Enter');

    const [response] = await Promise.all([
      page.waitForResponse((res) => res.url().includes('/api/profile') && res.request().method() === 'PUT'),
      page.getByRole('button', { name: /save changes/i }).click(),
    ]);

    expect(response.status()).toBe(200);
    expect(errors, `Unexpected page errors: ${errors.join('; ')}`).toEqual([]);
  });

  test('the public homepage reflects the updated bio', async ({ page }) => {
    await page.goto('/');
    await page.waitForResponse((res) => res.url().includes('/api/profile/public'));
    await expect(page.getByText(newBio)).toBeVisible({ timeout: 10_000 });
  });

  test('the public contact page reflects the updated location and phone', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForResponse((res) => res.url().includes('/api/profile/public'));
    await expect(page.getByText(newLocation)).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(newPhone)).toBeVisible({ timeout: 10_000 });
  });

  test('the homepage "What I Do" section reflects the new skill', async ({ page }) => {
    await page.goto('/');
    await page.waitForResponse((res) => res.url().includes('/api/profile/public'));
    await expect(page.getByText(newSkill)).toBeVisible({ timeout: 10_000 });
  });

  test('the browser tab title reflects the updated profile name', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(new RegExp(TEST_ADMIN.name));
  });
});
