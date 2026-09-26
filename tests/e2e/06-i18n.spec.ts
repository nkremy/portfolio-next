import { test, expect } from '@playwright/test';
import { trackPageErrors } from './helpers';

test.describe('Internationalization', () => {
  test.describe('with a French browser locale', () => {
    test.use({ locale: 'fr-FR' });

    test('visiting / redirects to /fr for a French browser', async ({ page }) => {
      const errors = trackPageErrors(page);
      await page.goto('/');
      await page.waitForURL('**/fr');
      await expect(page.getByRole('navigation').getByRole('link', { name: 'À propos' })).toBeVisible();
      expect(errors, `Unexpected page errors: ${errors.join('; ')}`).toEqual([]);
    });

    test('switching language does not trigger a full page reload', async ({ page }) => {
      await page.goto('/fr/about');
      await page.evaluate(() => {
        (window as unknown as { __navMarker?: boolean }).__navMarker = true;
      });

      await page.getByRole('button', { name: 'Switch to EN' }).click();
      await page.waitForURL('**/en/about');

      const markerSurvived = await page.evaluate(
        () => (window as unknown as { __navMarker?: boolean }).__navMarker === true
      );
      expect(markerSurvived).toBe(true);
    });

    test('the language switcher navigates between locales and preserves the current page', async ({ page }) => {
      const errors = trackPageErrors(page);
      await page.goto('/about');
      await expect(page.getByRole('heading', { name: 'Biographie' })).toBeVisible();

      await page.getByRole('button', { name: 'Switch to EN' }).click();
      await page.waitForURL('**/en/about');
      await expect(page.getByRole('heading', { name: 'Biography' })).toBeVisible();

      await page.getByRole('button', { name: 'Switch to FR' }).click();
      await page.waitForURL('**/fr/about');
      await expect(page.getByRole('heading', { name: 'Biographie' })).toBeVisible();

      expect(errors, `Unexpected page errors: ${errors.join('; ')}`).toEqual([]);
    });
  });

  test.describe('with an English browser locale', () => {
    test.use({ locale: 'en-US' });

    test('/en renders English', async ({ page }) => {
      const errors = trackPageErrors(page);
      await page.goto('/en');
      await expect(page.getByRole('navigation').getByRole('link', { name: 'About' })).toBeVisible();
      expect(errors, `Unexpected page errors: ${errors.join('; ')}`).toEqual([]);
    });
  });

  test('dashboard and auth routes are not localized', async ({ page }) => {
    await page.goto('/auth/signin');
    expect(page.url()).toContain('/auth/signin');
    expect(page.url()).not.toMatch(/\/(en|fr)\/auth/);
  });
});
