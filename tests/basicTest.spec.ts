import { expect, test } from '@playwright/test';
import { InwestycjaFormPage } from './pages/inwestycja-form.page';
import { KalkulatorFormPage } from './pages/kalkulator-form.page';

test('Happy path - Complete application flow', async ({ page }) => {
  //Put waitUntil: domcontentloaded otherwise on Firefox the test doesnt run
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  // NOTE: Step 1: Fill Inwestycja form
  const inwestycjaForm = new InwestycjaFormPage(page);
  await inwestycjaForm.fillCompleteForm({
    nazwa: 'Testowa inwestycja',
    identyfikator: '306401_1.0021.AR_09.58/3',
    typZabudowy: 'wielorodzinna',
    isPodlaczona: true,
  });

  // NOTE: Step 2: Fill Kalkulator form
  const kalkulatorForm = new KalkulatorFormPage(page);
  await kalkulatorForm.completeKalkulatorForm([
    '1000',
    '100',
    '200',
    '200',
    '300',
    '200',
  ]);

  // Assert Suma powierzchni is correct
  const sumLabel = page.getByText('Suma powierzchni P1, P2, P3, P4 [m2]');
  const sumValue = sumLabel.locator('..').locator('div');
  await expect(sumValue).toHaveText('800,00');

  //Assert Objetosc is correct
  const bziLabel = page.getByText(
    'Wymagana objętość obiektów błękitno-zielonej',
  );
  const bziInput = bziLabel.locator('..').locator('input');
  await expect(bziInput).toHaveValue('32.00');

  const detencyjnychLabel = page.getByText(
    'Wymagana objętość obiektów detencyjnych [m3]',
  );
  const detencyjnychInput = detencyjnychLabel.locator('..').locator('input');
  await expect(detencyjnychInput).toHaveValue('64.00');

  // NOTE: Step 3: Generate report
  const pobierzRaportButton = page.getByRole('button', {
    name: 'Pobierz raport pdf',
  });
  await pobierzRaportButton.click();
});
