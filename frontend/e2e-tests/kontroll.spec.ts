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

test('opprett kontroll', async ({ page }) => {
  await page.goto('/kontroll');

  await page.getByLabel('Velg kontrolltype').fill('Manuell kontroll');
  await page.fill('input[name="tittel"]', 'Test');
  await page.fill('input[name="saksbehandler"]', 'Test Testesen');
  await page.getByLabel('Forvaltningssak').check();
  await page.fill('input[name="arkivreferanse"]', '123');
  await page.click('button[type="submit"]');

  saveKontrollId(page);

  await expect(
    page.getByRole('heading', { name: 'Velg løsninger' })
  ).toBeVisible();

  await page.getByRole('button', { name: 'Velg løsninger fra utvalg' }).click();
  await page.getByTestId('utvalg').first().click();
  await page.getByRole('button', { name: 'Neste' }).click();

  await expect(page.getByRole('heading', { name: 'Sideutvalg' })).toBeVisible();
});

test.afterAll(async () => {
  const requestContext = await request.newContext();
  const promises = deleteThese.map((id) =>
    requestContext.delete('/api/v1/kontroller/' + id)
  );
  await Promise.all(promises);
});
