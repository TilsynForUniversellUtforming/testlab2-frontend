import { expect, test } from '@playwright/test';

test('send inn skjema', async ({ page }) => {
  await page.goto('/kontroll/opprett-kontroll');

  await page.getByLabel('Velg kontrolltype').fill('Manuell kontroll');
  await page.fill('input[name="tittel"]', 'Test');
  await page.fill('input[name="saksbehandler"]', 'Test Testesen');
  await page.getByLabel('Forvaltningssak').check();
  await page.fill('input[name="arkivreferanse"]', '123');
  await page.click('button[type="submit"]');

  await expect(
    page.getByRole('heading', { name: 'Velg løsninger' })
  ).toBeVisible();
});
