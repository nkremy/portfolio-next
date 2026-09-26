import { test, expect } from '@playwright/test';
import { trackPageErrors } from './helpers';

test.describe('Public navigation', () => {
  test('homepage loads without runtime errors', async ({ page }) => {
    const errors = trackPageErrors(page);
    await page.goto('/');
    await expect(page.locator('#home')).toBeVisible();
    await page.waitForTimeout(500);
    expect(errors, `Unexpected page errors: ${errors.join('; ')}`).toEqual([]);
  });

  test('navigating home -> about -> projects -> certifications -> blogs -> contact -> home has no runtime errors', async ({ page }) => {
    // Visits 6 distinct routes that may each need a cold Turbopack compile
    // on first hit in dev mode, so give this one more headroom than the
    // default per-test timeout.
    test.setTimeout(60_000);
    const errors = trackPageErrors(page);

    await page.goto('/');
    await page.waitForTimeout(300);

    for (const path of ['/about', '/projects', '/certifications', '/blogs', '/contact', '/']) {
      await page.goto(path);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(400);
    }

    expect(errors, `Unexpected page errors: ${errors.join('; ')}`).toEqual([]);
  });

  test('theme toggle switches between light and dark without errors', async ({ page }) => {
    const errors = trackPageErrors(page);
    await page.goto('/');

    const html = page.locator('html');
    const initialIsDark = await html.evaluate((el) => el.classList.contains('dark'));

    const themeToggle = page.getByRole('button', { name: /toggle theme|dark mode|light mode/i }).first();
    if (await themeToggle.count()) {
      await themeToggle.click();
      await page.waitForTimeout(300);
      const afterIsDark = await html.evaluate((el) => el.classList.contains('dark'));
      expect(afterIsDark).not.toBe(initialIsDark);
    }

    expect(errors, `Unexpected page errors: ${errors.join('; ')}`).toEqual([]);
  });

  test('mobile menu opens and closes without errors', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const errors = trackPageErrors(page);
    await page.goto('/en');

    const openButton = page.getByRole('button', { name: 'Open menu' });
    await openButton.click();
    await page.waitForTimeout(400);

    const closeButton = page.getByRole('button', { name: 'Close mobile menu' });
    await closeButton.click();
    await page.waitForTimeout(400);

    expect(errors, `Unexpected page errors: ${errors.join('; ')}`).toEqual([]);
  });
});
