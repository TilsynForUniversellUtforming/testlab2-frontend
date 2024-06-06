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

  await expect(
    page.getByRole('heading', { name: 'Vel løysingar' })
  ).toBeVisible();

  saveKontrollId(page);

  await page.getByRole('button', { name: 'Vel løysingar frå utval' }).click();
  await page.getByTestId('utvalg').first().click();
  await page.getByRole('button', { name: 'Lagre og gå til neste' }).click();

  await expect(page.getByTestId('testreglar-heading')).toBeVisible();
});

// test('opprett forenkla kontroll', async ({ page }) => {
//   // Opprett grunndata
//   await page.goto('/kontroll');
//   await page.getByLabel('arrow down').click();
//   await page.getByLabel('Forenkla kontroll').click();
//   await page.getByLabel('Tittel*').click();
//   await page.getByLabel('Tittel*').fill('Test forenkla');
//   await page.getByLabel('Saksbehandler*').click();
//   await page.getByLabel('Saksbehandler*').fill('Test Testesen');
//   await page
//     .getByRole('button', { name: 'Opprett resten av kontrollen' })
//     .click();
//
//   // Velg et utvalg
//   await expect(
//     page.getByRole('heading', { name: 'Vel løysingar' })
//   ).toBeVisible();
//
//   saveKontrollId(page);
//
//   await page.getByRole('button', { name: 'Vel løysingar frå utval' }).click();
//   await page.getByTestId('utvalg').first().click();
//   await page.getByRole('button', { name: 'Lagre og gå til neste' }).click();
//
//   // Velg en testregel
//   await expect(
//     page.getByRole('heading', { name: 'Vel testreglar' })
//   ).toBeVisible();
//   await page.getByRole('button', { name: 'Vel testreglar sjølv' }).click();
//   await page.getByTestId('manuell-testregel').first().click();
//   await page.getByRole('button', { name: 'Lagre og gå til neste' }).click();
//
//   // Sideutval
//   await expect(
//     page.getByRole('heading', { name: 'Sideutval', exact: true })
//   ).toBeVisible();
//
//   await page.getByTestId('automatisk-sideutval-netto').first().fill('20');
//   await page.getByRole('button', { name: 'Lagre og gå til neste' }).click();
//
//   await expect(
//     page.getByRole('heading', { name: 'Kontrollen er opprettet' })
//   ).toBeVisible();
// });

test.afterAll(async () => {
  const requestContext = await request.newContext();
  const promises = deleteThese.map((id) =>
    requestContext.delete('/api/v1/kontroller/' + id)
  );
  await Promise.all(promises);
});
