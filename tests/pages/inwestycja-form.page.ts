import { Page, Locator } from '@playwright/test';

export class InwestycjaFormPage {
  readonly page: Page;
  private readonly inwestycjaFormInputs: Locator;
  private readonly collapsible: Locator;
  private readonly zatwierdzButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inwestycjaFormInputs = page
      .locator('[data-slot="accordion"]')
      .filter({ hasText: 'Szczegóły inwestycji' })
      .locator('[data-slot="form-item"]');
    this.collapsible = page
      .locator('[data-slot="accordion"]')
      .filter({ hasText: 'Szczegóły inwestycji' })
      .locator('[data-slot="collapsible"]');
    this.zatwierdzButton = page
      .locator('[data-slot="accordion"]')
      .filter({ hasText: 'Szczegóły inwestycji' })
      .getByRole('button', { name: 'Zatwierdź' });
  }

  private getFormField(label: string): Locator {
    return this.inwestycjaFormInputs.filter({ hasText: label });
  }

  private async fillNazwaInwestycji(nazwa: string) {
    const input = this.getFormField('Nazwa inwestycji').locator('input');
    await input.fill(nazwa);
  }

  //   private async fillIdentyfikatorDzialki(identyfikator: string) {
  //     const input = this.getFormField(
  //       'Identyfikator działki inwestycyjnej',
  //     ).locator('input');
  //     await input.fill(identyfikator);
  //   }

  private async openMapModalAndSelectDzialka(identyfikator: string) {
    const mapIcon = this.getFormField(
      'Identyfikator działki inwestycyjnej',
    ).locator('svg');
    await mapIcon.click();
    this.page
      .getByPlaceholder('Wpisz adres lub nr działki')
      .fill(identyfikator);
    await this.page.getByRole('button', { name: 'Szukaj działki' }).click();
    await this.page.getByAltText('Marker').click();
    await this.page.getByRole('button', { name: 'Wybierz' }).click();
  }

  private async openCollapsible() {
    await this.collapsible.click();
  }

  private async selectTypZabudowy(typ: 'wielorodzinna' | 'jednorodzinna') {
    const label =
      typ === 'wielorodzinna'
        ? 'wielorodzinna / usługowa / przemysłowa'
        : 'jednorodzinna';
    const input = this.getFormField('Typ planowanej zabudowy').getByLabel(
      label,
    );
    await input.check();
  }

  private async selectPodlaczenieKanalizacji(isPodlaczona: boolean) {
    const label = isPodlaczona ? 'tak' : 'nie';
    const input = this.getFormField(
      'Czy dana zabudowa ma zostać podłączona do miejskiej sieci kanalizacji deszczowej?',
    ).getByLabel(label);
    await input.check();
  }

  private async submitForm() {
    await this.zatwierdzButton.click();
  }

  private async closeMapModal() {
    await this.page.getByAltText('Marker').click();
    await this.page.getByRole('button', { name: 'Zamknij mapę' }).click();
  }

  async fillCompleteForm(data: {
    nazwa: string;
    identyfikator: string;
    typZabudowy: 'wielorodzinna' | 'jednorodzinna';
    isPodlaczona: boolean;
  }) {
    await this.fillNazwaInwestycji(data.nazwa);
    // await this.fillIdentyfikatorDzialki(data.identyfikator);
    await this.openMapModalAndSelectDzialka(data.identyfikator);
    await this.openCollapsible();
    await this.selectTypZabudowy(data.typZabudowy);
    await this.selectPodlaczenieKanalizacji(data.isPodlaczona);
    await this.submitForm();
    await this.closeMapModal();
  }
}
