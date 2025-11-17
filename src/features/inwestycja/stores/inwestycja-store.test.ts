import { describe, expect, test, beforeEach } from 'vitest';
import { useInwestycjaStore } from './inwestycja-store';
import type { InwestycjaModel, DzialkaModel } from '@/types/inwestycja-model';

describe('inwestycja-store', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useInwestycjaStore.getState().reset();
  });

  describe('initial state', () => {
    test('should have correct initial values', () => {
      const state = useInwestycjaStore.getState();

      expect(state.nazwaInwestycji).toBe('');
      expect(state.identyfikatorInwestycji).toBe('');
      expect(state.typZabudowy).toBe('jednorodzinna');
      expect(state.isPodlaczony).toBe('nie');
      expect(state.isIstniejacePolaczenie).toBe('nie');
      expect(state.daneDzialki).toBeUndefined();
      expect(state.mapScreenshot).toBeUndefined();
      expect(state.isInwestycjaSubmitted).toBe(false);
    });
  });

  describe('setForm', () => {
    test('should update form data', () => {
      const formData: InwestycjaModel = {
        nazwaInwestycji: 'Test Project',
        identyfikatorInwestycji: '140501_1.0001.123/1',
        typZabudowy: 'wielorodzinna',
        isPodlaczony: 'tak',
        isIstniejacePolaczenie: 'tak',
      };

      useInwestycjaStore.getState().setForm(formData);
      const state = useInwestycjaStore.getState();

      expect(state.nazwaInwestycji).toBe('Test Project');
      expect(state.identyfikatorInwestycji).toBe('140501_1.0001.123/1');
      expect(state.typZabudowy).toBe('wielorodzinna');
      expect(state.isPodlaczony).toBe('tak');
      expect(state.isIstniejacePolaczenie).toBe('tak');
    });

    test('should partially update form data', () => {
      useInwestycjaStore.getState().setForm({
        nazwaInwestycji: 'Initial Project',
        identyfikatorInwestycji: '140501_1.0001.123/1',
        typZabudowy: 'jednorodzinna',
        isPodlaczony: 'nie',
        isIstniejacePolaczenie: 'nie',
      });

      useInwestycjaStore.getState().setForm({
        nazwaInwestycji: 'Updated Project',
        identyfikatorInwestycji: '140501_1.0001.123/1',
        typZabudowy: 'jednorodzinna',
        isPodlaczony: 'nie',
        isIstniejacePolaczenie: 'nie',
      });

      const state = useInwestycjaStore.getState();
      expect(state.nazwaInwestycji).toBe('Updated Project');
    });
  });

  describe('setDaneDzialki', () => {
    test('should set daneDzialki data', () => {
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

      useInwestycjaStore.getState().setDaneDzialki(dzialkaData);
      const state = useInwestycjaStore.getState();

      expect(state.daneDzialki).toEqual(dzialkaData);
      expect(state.daneDzialki?.id).toBe('140501_1.0001.123/1');
      expect(state.daneDzialki?.voivodeship).toBe('mazowieckie');
    });

    test('should clear daneDzialki when set to undefined', () => {
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
        polygonCoordinates: [[21.0122, 52.2297]],
      };

      useInwestycjaStore.getState().setDaneDzialki(dzialkaData);
      expect(useInwestycjaStore.getState().daneDzialki).toBeDefined();

      useInwestycjaStore.getState().setDaneDzialki(undefined);
      expect(useInwestycjaStore.getState().daneDzialki).toBeUndefined();
    });
  });

  describe('setMapScreenshot', () => {
    test('should set map screenshot', () => {
      const screenshot = 'data:image/png;base64,iVBORw0KGgoAAAANS';

      useInwestycjaStore.getState().setMapScreenshot(screenshot);
      const state = useInwestycjaStore.getState();

      expect(state.mapScreenshot).toBe(screenshot);
    });

    test('should clear map screenshot when set to undefined', () => {
      useInwestycjaStore.getState().setMapScreenshot('screenshot-data');
      expect(useInwestycjaStore.getState().mapScreenshot).toBe(
        'screenshot-data',
      );

      useInwestycjaStore.getState().setMapScreenshot(undefined);
      expect(useInwestycjaStore.getState().mapScreenshot).toBeUndefined();
    });
  });

  describe('submitInwestycja', () => {
    test('should set isInwestycjaSubmitted to true', () => {
      expect(useInwestycjaStore.getState().isInwestycjaSubmitted).toBe(false);

      useInwestycjaStore.getState().submitInwestycja();

      expect(useInwestycjaStore.getState().isInwestycjaSubmitted).toBe(true);
    });

    test('should keep isInwestycjaSubmitted true on multiple calls', () => {
      useInwestycjaStore.getState().submitInwestycja();
      expect(useInwestycjaStore.getState().isInwestycjaSubmitted).toBe(true);

      useInwestycjaStore.getState().submitInwestycja();
      expect(useInwestycjaStore.getState().isInwestycjaSubmitted).toBe(true);
    });
  });

  describe('reset', () => {
    test('should reset store to initial state', () => {
      // Set up some state
      useInwestycjaStore.getState().setForm({
        nazwaInwestycji: 'Test Project',
        identyfikatorInwestycji: '140501_1.0001.123/1',
        typZabudowy: 'wielorodzinna',
        isPodlaczony: 'tak',
        isIstniejacePolaczenie: 'tak',
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
      useInwestycjaStore.getState().setMapScreenshot('screenshot-data');
      useInwestycjaStore.getState().submitInwestycja();

      // Reset
      useInwestycjaStore.getState().reset();

      // Verify reset
      const state = useInwestycjaStore.getState();
      expect(state.nazwaInwestycji).toBe('');
      expect(state.identyfikatorInwestycji).toBe('');
      expect(state.typZabudowy).toBe('jednorodzinna');
      expect(state.isPodlaczony).toBe('nie');
      expect(state.isIstniejacePolaczenie).toBe('nie');
      expect(state.daneDzialki).toBeUndefined();
      expect(state.mapScreenshot).toBeUndefined();
      expect(state.isInwestycjaSubmitted).toBe(false);
    });
  });

  describe('persistence', () => {
    test('should persist to localStorage with correct key', () => {
      const formData: InwestycjaModel = {
        nazwaInwestycji: 'Persistent Project',
        identyfikatorInwestycji: '140501_1.0001.123/1',
        typZabudowy: 'jednorodzinna',
        isPodlaczony: 'nie',
        isIstniejacePolaczenie: 'nie',
      };

      useInwestycjaStore.getState().setForm(formData);

      // Verify localStorage (note: in vitest environment, localStorage might need to be mocked)
      const stored = localStorage.getItem('inwestycjaStore');
      expect(stored).toBeTruthy();
    });
  });
});
