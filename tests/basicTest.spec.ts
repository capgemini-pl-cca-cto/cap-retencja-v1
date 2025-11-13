import { test } from '@playwright/test';
import { InwestycjaFormPage } from './pages/inwestycja-form.page';
import { KalkulatorFormPage } from './pages/kalkulator-form.page';

test('Happy path - Complete application flow', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Step 1: Fill Inwestycja form
  const inwestycjaForm = new InwestycjaFormPage(page);
  await inwestycjaForm.fillCompleteForm({
    nazwa: 'Testowa inwestycja',
    identyfikator: '306401_1.0021.AR_09.58/3',
    typZabudowy: 'wielorodzinna',
    isPodlaczona: true,
  });

  // TODO: Step 2: Fill Kalkulator form
  const kalkulatorForm = new KalkulatorFormPage(page);
  await kalkulatorForm.completeKalkulatorForm([
    '1000',
    '100',
    '200',
    '200',
    '300',
    '200',
  ]);

  // TODO: Step 3: Generate report
  const pobierzRaportButton = page.getByRole('button', {
    name: 'Pobierz raport pdf',
  });
  await pobierzRaportButton.click();
});
