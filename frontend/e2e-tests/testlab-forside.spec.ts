import { expect, test } from '@playwright/test';

test('laster forsida', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Meny' })).toBeVisible();
});
