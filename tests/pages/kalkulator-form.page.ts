import { Locator, Page } from '@playwright/test';

export class KalkulatorFormPage {
  readonly page: Page;
  private readonly kalkulatorFormInputs: Locator;
  private readonly przeliczButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.kalkulatorFormInputs = page
      .locator('[data-slot="accordion"]')
      .filter({ hasText: 'Dane do bilansu objętości wody opadowej' })
      .locator('[data-slot="form-item"]');
    this.przeliczButton = page
      .locator('[data-slot="accordion"]')
      .filter({ hasText: 'Dane do bilansu objętości wody opadowej' })
      .getByRole('button', { name: 'Przelicz' });
  }

  private getFormField(label: string): Locator {
    return this.kalkulatorFormInputs.filter({ hasText: label });
  }

  private async fillInput(pole: string, powierzchnia: string) {
    const input = this.getFormField(pole).locator('input');
    await input.fill(powierzchnia);
  }

  private async submitForm() {
    await this.przeliczButton.click();
  }

  async completeKalkulatorForm(
    data: [string, string, string, string, string, string],
  ) {
    await this.fillInput('P0', data[0]);
    await this.fillInput('P1', data[1]);
    await this.fillInput('P2.', data[2]);
    await this.fillInput('P3', data[3]);
    await this.fillInput('P4', data[4]);
    await this.fillInput('P5.', data[5]);
    await this.submitForm();
  }
}
