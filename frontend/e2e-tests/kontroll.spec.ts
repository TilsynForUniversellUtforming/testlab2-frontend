import { expect, Page, request, test } from '@playwright/test';

const deleteThese: number[] = [];

function saveKontrollId(page: Page) {
  const url = page.url();
  const pattern = /\/kontroll\/(\d+)/;
  const match = url.match(pattern);
  if (match) {
    deleteThese.push(parseInt(match[1]));
  }
}

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

  saveKontrollId(page);
});

test.afterAll(async () => {
  for (const id of deleteThese) {
    const requestContext = await request.newContext();
    await requestContext.delete('/api/v1/kontroller/' + id);
  }
});
