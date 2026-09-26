import { test, expect } from '@playwright/test';
import { trackPageErrors } from './helpers';

test.describe('Project detail + carousel', () => {
  test('seeded project detail page renders and shows broken-image fallback gracefully', async ({ page }) => {
    const errors = trackPageErrors(page);

    await page.goto('/projects/e2e-test-project');
    await expect(page.getByRole('heading', { name: 'E2E Test Project' })).toBeVisible();

    // The seeded thumbnail/images intentionally 404 - the fallback gradient
    // block should render instead of a broken <img>, with no runtime crash.
    await expect(page.getByText('Project Screenshot').first()).toBeVisible({ timeout: 10_000 });

    expect(errors, `Unexpected page errors: ${errors.join('; ')}`).toEqual([]);
  });

  test('navigating carousel next/previous repeatedly does not throw removeChild-style errors', async ({ page }) => {
    const errors = trackPageErrors(page);
    await page.goto('/projects/e2e-test-project');
    await page.waitForTimeout(500);

    const nextButton = page.locator('button').filter({ hasText: '' }).getByRole('img', { name: '' });
    const carouselNext = page.locator('[data-slot="carousel-next"], button[aria-label="Next slide"]').first();
    const carouselPrev = page.locator('[data-slot="carousel-previous"], button[aria-label="Previous slide"]').first();

    if (await carouselNext.count()) {
      for (let i = 0; i < 6; i++) {
        await carouselNext.click({ trial: false }).catch(() => {});
        await page.waitForTimeout(150);
      }
      for (let i = 0; i < 6; i++) {
        await carouselPrev.click({ trial: false }).catch(() => {});
        await page.waitForTimeout(150);
      }
    }

    expect(errors, `Unexpected page errors: ${errors.join('; ')}`).toEqual([]);
  });

  test('projects listing page renders the seeded project card without errors', async ({ page }) => {
    const errors = trackPageErrors(page);
    await page.goto('/projects');
    await expect(page.getByText('E2E Test Project')).toBeVisible();
    await page.waitForTimeout(400);
    expect(errors, `Unexpected page errors: ${errors.join('; ')}`).toEqual([]);
  });
});
