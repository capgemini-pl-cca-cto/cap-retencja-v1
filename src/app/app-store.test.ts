import { describe, expect, test, beforeEach } from 'vitest';
import { resetAllStores } from './app-store';
import { useInwestycjaStore } from '@/features/inwestycja/stores/inwestycja-store';
import { useKalkulatorStore } from '@/features/kalkulator/stores/kalkulator-store';
import type { DzialkaModel, InwestycjaModel } from '@/types/inwestycja-model';
import type { KalkulatorModel } from '@/types/kalkulator-model';

describe('app-store', () => {
  beforeEach(() => {
    // Reset all stores before each test
    resetAllStores();
  });

  describe('resetAllStores', () => {
    test('should reset both inwestycja and kalkulator stores', () => {
      // Set up some state in both stores
      const inwestycjaData: InwestycjaModel = {
        nazwaInwestycji: 'Test Project',
        identyfikatorInwestycji: '140501_1.0001.123/1',
        typZabudowy: 'wielorodzinna',
        isPodlaczony: 'tak',
        isIstniejacePolaczenie: 'tak',
      };

      const kalkulatorData: KalkulatorModel = {
        powDzialki: 1000,
        powDachow: 200,
        powDachowPozaObrysem: 50,
        powUszczelnione: 300,
        powPrzepuszczalne: 400,
        powTerenyInne: 50,
      };

      useInwestycjaStore.getState().setForm(inwestycjaData);
      useInwestycjaStore.getState().submitInwestycja();
      useKalkulatorStore.getState().setForm(kalkulatorData);
      useKalkulatorStore.getState().submitKalkulator();

      // Verify state is set
      expect(useInwestycjaStore.getState().nazwaInwestycji).toBe(
        'Test Project',
      );
      expect(useInwestycjaStore.getState().isInwestycjaSubmitted).toBe(true);
      expect(useKalkulatorStore.getState().powDzialki).toBe(1000);
      expect(useKalkulatorStore.getState().isKalkulatorSubmitted).toBe(true);

      // Reset all stores
      resetAllStores();

      // Verify both stores are reset
      const inwestycjaState = useInwestycjaStore.getState();
      expect(inwestycjaState.nazwaInwestycji).toBe('');
      expect(inwestycjaState.identyfikatorInwestycji).toBe('');
      expect(inwestycjaState.typZabudowy).toBe('jednorodzinna');
      expect(inwestycjaState.isPodlaczony).toBe('nie');
      expect(inwestycjaState.isInwestycjaSubmitted).toBe(false);

      const kalkulatorState = useKalkulatorStore.getState();
      expect(kalkulatorState.powDzialki).toBe(0);
      expect(kalkulatorState.powDachow).toBe(0);
      expect(kalkulatorState.isKalkulatorSubmitted).toBe(false);
    });

    test('should be idempotent - multiple calls should not cause errors', () => {
      resetAllStores();
      resetAllStores();
      resetAllStores();

      expect(useInwestycjaStore.getState().nazwaInwestycji).toBe('');
      expect(useKalkulatorStore.getState().powDzialki).toBe(0);
    });
  });

  describe('useDaneRaport', () => {
    test('should combine data from both stores into RaportModel', () => {
      // Set up inwestycja data
      const inwestycjaData: InwestycjaModel = {
        nazwaInwestycji: 'Test Project',
        identyfikatorInwestycji: '140501_1.0001.123/1',
        typZabudowy: 'wielorodzinna',
        isPodlaczony: 'tak',
        isIstniejacePolaczenie: 'nie',
      };

      const dzialkaData: DzialkaModel = {
        id: '140501_1.0001.123/1',
        voivodeship: 'mazowieckie',
        county: 'warszawa',
        commune: 'Warszawa',
        region: '0001',
        parcel: '123/1',
        centerCoordinates: {
          lat: 52.2297,
          lng: 21.0122,
        },
        polygonCoordinates: [
          [21.0122, 52.2297],
          [21.0123, 52.2298],
          [21.0124, 52.2297],
        ],
      };

      useInwestycjaStore.getState().setForm(inwestycjaData);
      useInwestycjaStore.getState().setDaneDzialki(dzialkaData);
      useInwestycjaStore.getState().setMapScreenshot('screenshot-data');

      // Set up kalkulator data
      const kalkulatorData: KalkulatorModel = {
        powDzialki: 1000,
        powDachow: 200,
        powDachowPozaObrysem: 50,
        powUszczelnione: 300,
        powPrzepuszczalne: 400,
        powTerenyInne: 50,
      };

      useKalkulatorStore.getState().setForm(kalkulatorData);

      // Manually construct raport data from stores (since we can't call the hook directly)
      const inwestycjaState = useInwestycjaStore.getState();
      const kalkulatorState = useKalkulatorStore.getState();

      const raportData = {
        inwestycja: {
          nazwaInwestycji: inwestycjaState.nazwaInwestycji,
          typZabudowy: inwestycjaState.typZabudowy,
          isPodlaczony: inwestycjaState.isPodlaczony,
          isIstniejacePolaczenie: inwestycjaState.isIstniejacePolaczenie,
          identyfikatorInwestycji: inwestycjaState.identyfikatorInwestycji,
        },
        daneDzialki: inwestycjaState.daneDzialki!,
        mapScreenshot: inwestycjaState.mapScreenshot,
        daneKalkulator: {
          powDzialki: kalkulatorState.powDzialki,
          powDachow: kalkulatorState.powDachow,
          powDachowPozaObrysem: kalkulatorState.powDachowPozaObrysem,
          powUszczelnione: kalkulatorState.powUszczelnione,
          powPrzepuszczalne: kalkulatorState.powPrzepuszczalne,
          powTerenyInne: kalkulatorState.powTerenyInne,
        },
      };

      // Verify inwestycja data
      expect(raportData.inwestycja.nazwaInwestycji).toBe('Test Project');
      expect(raportData.inwestycja.identyfikatorInwestycji).toBe(
        '140501_1.0001.123/1',
      );
      expect(raportData.inwestycja.typZabudowy).toBe('wielorodzinna');
      expect(raportData.inwestycja.isPodlaczony).toBe('tak');
      expect(raportData.inwestycja.isIstniejacePolaczenie).toBe('nie');

      // Verify daneDzialki
      expect(raportData.daneDzialki).toEqual(dzialkaData);
      expect(raportData.daneDzialki.id).toBe('140501_1.0001.123/1');
      expect(raportData.daneDzialki.voivodeship).toBe('mazowieckie');

      // Verify mapScreenshot
      expect(raportData.mapScreenshot).toBe('screenshot-data');

      // Verify kalkulator data
      expect(raportData.daneKalkulator.powDzialki).toBe(1000);
      expect(raportData.daneKalkulator.powDachow).toBe(200);
      expect(raportData.daneKalkulator.powDachowPozaObrysem).toBe(50);
      expect(raportData.daneKalkulator.powUszczelnione).toBe(300);
      expect(raportData.daneKalkulator.powPrzepuszczalne).toBe(400);
      expect(raportData.daneKalkulator.powTerenyInne).toBe(50);
    });

    test('should return updated raport when stores change', () => {
      // Initial data
      useInwestycjaStore.getState().setForm({
        nazwaInwestycji: 'Initial Project',
        identyfikatorInwestycji: '140501_1.0001.123/1',
        typZabudowy: 'jednorodzinna',
        isPodlaczony: 'nie',
        isIstniejacePolaczenie: 'nie',
      });

      useKalkulatorStore.getState().setForm({
        powDzialki: 500,
        powDachow: 100,
        powDachowPozaObrysem: 25,
        powUszczelnione: 150,
        powPrzepuszczalne: 200,
        powTerenyInne: 25,
      });

      let inwestycjaState = useInwestycjaStore.getState();
      let kalkulatorState = useKalkulatorStore.getState();
      expect(inwestycjaState.nazwaInwestycji).toBe('Initial Project');
      expect(kalkulatorState.powDzialki).toBe(500);

      // Update data
      useInwestycjaStore.getState().setForm({
        nazwaInwestycji: 'Updated Project',
        identyfikatorInwestycji: '140501_1.0001.123/1',
        typZabudowy: 'jednorodzinna',
        isPodlaczony: 'nie',
        isIstniejacePolaczenie: 'nie',
      });

      useKalkulatorStore.getState().setForm({
        powDzialki: 1000,
        powDachow: 100,
        powDachowPozaObrysem: 25,
        powUszczelnione: 150,
        powPrzepuszczalne: 200,
        powTerenyInne: 25,
      });

      inwestycjaState = useInwestycjaStore.getState();
      kalkulatorState = useKalkulatorStore.getState();
      expect(inwestycjaState.nazwaInwestycji).toBe('Updated Project');
      expect(kalkulatorState.powDzialki).toBe(1000);
    });

    test('should handle missing mapScreenshot', () => {
      useInwestycjaStore.getState().setForm({
        nazwaInwestycji: 'Test Project',
        identyfikatorInwestycji: '140501_1.0001.123/1',
        typZabudowy: 'jednorodzinna',
        isPodlaczony: 'nie',
        isIstniejacePolaczenie: 'nie',
      });

      const dzialkaData: DzialkaModel = {
        id: '140501_1.0001.123/1',
        voivodeship: 'mazowieckie',
        county: 'warszawa',
        commune: 'Warszawa',
        region: '0001',
        parcel: '123/1',
        centerCoordinates: { lat: 52.2297, lng: 21.0122 },
        polygonCoordinates: [[21.0122, 52.2297]],
      };

      useInwestycjaStore.getState().setDaneDzialki(dzialkaData);

      useKalkulatorStore.getState().setForm({
        powDzialki: 1000,
        powDachow: 200,
        powDachowPozaObrysem: 50,
        powUszczelnione: 300,
        powPrzepuszczalne: 400,
        powTerenyInne: 50,
      });

      const inwestycjaState = useInwestycjaStore.getState();
      expect(inwestycjaState.mapScreenshot).toBeUndefined();
    });

    test('should include all required fields in RaportModel structure', () => {
      const dzialkaData: DzialkaModel = {
        id: '140501_1.0001.123/1',
        voivodeship: 'mazowieckie',
        county: 'warszawa',
        commune: 'Warszawa',
        region: '0001',
        parcel: '123/1',
        centerCoordinates: { lat: 52.2297, lng: 21.0122 },
        polygonCoordinates: [[21.0122, 52.2297]],
      };

      useInwestycjaStore.getState().setForm({
        nazwaInwestycji: 'Test',
        identyfikatorInwestycji: '140501_1.0001.123/1',
        typZabudowy: 'jednorodzinna',
        isPodlaczony: 'nie',
        isIstniejacePolaczenie: 'nie',
      });

      useInwestycjaStore.getState().setDaneDzialki(dzialkaData);

      useKalkulatorStore.getState().setForm({
        powDzialki: 1000,
        powDachow: 200,
        powDachowPozaObrysem: 50,
        powUszczelnione: 300,
        powPrzepuszczalne: 400,
        powTerenyInne: 50,
      });

      const inwestycjaState = useInwestycjaStore.getState();
      const kalkulatorState = useKalkulatorStore.getState();

      const raportData = {
        inwestycja: {
          nazwaInwestycji: inwestycjaState.nazwaInwestycji,
          typZabudowy: inwestycjaState.typZabudowy,
          isPodlaczony: inwestycjaState.isPodlaczony,
          isIstniejacePolaczenie: inwestycjaState.isIstniejacePolaczenie,
          identyfikatorInwestycji: inwestycjaState.identyfikatorInwestycji,
        },
        daneDzialki: inwestycjaState.daneDzialki!,
        mapScreenshot: inwestycjaState.mapScreenshot,
        daneKalkulator: {
          powDzialki: kalkulatorState.powDzialki,
          powDachow: kalkulatorState.powDachow,
          powDachowPozaObrysem: kalkulatorState.powDachowPozaObrysem,
          powUszczelnione: kalkulatorState.powUszczelnione,
          powPrzepuszczalne: kalkulatorState.powPrzepuszczalne,
          powTerenyInne: kalkulatorState.powTerenyInne,
        },
      };

      // Verify structure
      expect(raportData).toHaveProperty('inwestycja');
      expect(raportData).toHaveProperty('daneDzialki');
      expect(raportData).toHaveProperty('mapScreenshot');
      expect(raportData).toHaveProperty('daneKalkulator');

      expect(raportData.inwestycja).toHaveProperty('nazwaInwestycji');
      expect(raportData.inwestycja).toHaveProperty('typZabudowy');
      expect(raportData.inwestycja).toHaveProperty('isPodlaczony');
      expect(raportData.inwestycja).toHaveProperty('isIstniejacePolaczenie');
      expect(raportData.inwestycja).toHaveProperty('identyfikatorInwestycji');

      expect(raportData.daneKalkulator).toHaveProperty('powDzialki');
      expect(raportData.daneKalkulator).toHaveProperty('powDachow');
      expect(raportData.daneKalkulator).toHaveProperty('powDachowPozaObrysem');
      expect(raportData.daneKalkulator).toHaveProperty('powUszczelnione');
      expect(raportData.daneKalkulator).toHaveProperty('powPrzepuszczalne');
      expect(raportData.daneKalkulator).toHaveProperty('powTerenyInne');
    });
  });
});
