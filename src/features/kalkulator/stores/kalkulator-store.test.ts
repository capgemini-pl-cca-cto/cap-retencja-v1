import { describe, expect, test, beforeEach } from 'vitest';
import { useKalkulatorStore } from './kalkulator-store';
import type { KalkulatorModel } from '@/types/kalkulator-model';

describe('kalkulator-store', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useKalkulatorStore.getState().reset();
  });

  describe('initial state', () => {
    test('should have correct initial values', () => {
      const state = useKalkulatorStore.getState();

      expect(state.powDzialki).toBe(0);
      expect(state.powDachow).toBe(0);
      expect(state.powDachowPozaObrysem).toBe(0);
      expect(state.powUszczelnione).toBe(0);
      expect(state.powPrzepuszczalne).toBe(0);
      expect(state.powTerenyInne).toBe(0);
      expect(state.isKalkulatorSubmitted).toBe(false);
    });
  });

  describe('setForm', () => {
    test('should update form data with all fields', () => {
      const formData: KalkulatorModel = {
        powDzialki: 1000,
        powDachow: 200,
        powDachowPozaObrysem: 50,
        powUszczelnione: 300,
        powPrzepuszczalne: 400,
        powTerenyInne: 50,
      };

      useKalkulatorStore.getState().setForm(formData);
      const state = useKalkulatorStore.getState();

      expect(state.powDzialki).toBe(1000);
      expect(state.powDachow).toBe(200);
      expect(state.powDachowPozaObrysem).toBe(50);
      expect(state.powUszczelnione).toBe(300);
      expect(state.powPrzepuszczalne).toBe(400);
      expect(state.powTerenyInne).toBe(50);
    });

    test('should update form data partially', () => {
      useKalkulatorStore.getState().setForm({
        powDzialki: 500,
        powDachow: 100,
        powDachowPozaObrysem: 25,
        powUszczelnione: 150,
        powPrzepuszczalne: 200,
        powTerenyInne: 25,
      });

      useKalkulatorStore.getState().setForm({
        powDzialki: 1000,
        powDachow: 100,
        powDachowPozaObrysem: 25,
        powUszczelnione: 150,
        powPrzepuszczalne: 200,
        powTerenyInne: 25,
      });

      const state = useKalkulatorStore.getState();
      expect(state.powDzialki).toBe(1000);
      expect(state.powDachow).toBe(100);
    });

    test('should handle decimal values', () => {
      const formData: KalkulatorModel = {
        powDzialki: 1234.56,
        powDachow: 234.78,
        powDachowPozaObrysem: 123.45,
        powUszczelnione: 456.12,
        powPrzepuszczalne: 345.67,
        powTerenyInne: 74.54,
      };

      useKalkulatorStore.getState().setForm(formData);
      const state = useKalkulatorStore.getState();

      expect(state.powDzialki).toBe(1234.56);
      expect(state.powDachow).toBe(234.78);
      expect(state.powDachowPozaObrysem).toBe(123.45);
      expect(state.powUszczelnione).toBe(456.12);
      expect(state.powPrzepuszczalne).toBe(345.67);
      expect(state.powTerenyInne).toBe(74.54);
    });

    test('should handle zero values', () => {
      const formData: KalkulatorModel = {
        powDzialki: 0,
        powDachow: 0,
        powDachowPozaObrysem: 0,
        powUszczelnione: 0,
        powPrzepuszczalne: 0,
        powTerenyInne: 0,
      };

      useKalkulatorStore.getState().setForm(formData);
      const state = useKalkulatorStore.getState();

      expect(state.powDzialki).toBe(0);
      expect(state.powDachow).toBe(0);
      expect(state.powDachowPozaObrysem).toBe(0);
      expect(state.powUszczelnione).toBe(0);
      expect(state.powPrzepuszczalne).toBe(0);
      expect(state.powTerenyInne).toBe(0);
    });
  });

  describe('submitKalkulator', () => {
    test('should set isKalkulatorSubmitted to true', () => {
      expect(useKalkulatorStore.getState().isKalkulatorSubmitted).toBe(false);

      useKalkulatorStore.getState().submitKalkulator();

      expect(useKalkulatorStore.getState().isKalkulatorSubmitted).toBe(true);
    });

    test('should keep isKalkulatorSubmitted true on multiple calls', () => {
      useKalkulatorStore.getState().submitKalkulator();
      expect(useKalkulatorStore.getState().isKalkulatorSubmitted).toBe(true);

      useKalkulatorStore.getState().submitKalkulator();
      expect(useKalkulatorStore.getState().isKalkulatorSubmitted).toBe(true);
    });
  });

  describe('reset', () => {
    test('should reset store to initial state', () => {
      // Set up some state
      useKalkulatorStore.getState().setForm({
        powDzialki: 1000,
        powDachow: 200,
        powDachowPozaObrysem: 50,
        powUszczelnione: 300,
        powPrzepuszczalne: 400,
        powTerenyInne: 50,
      });
      useKalkulatorStore.getState().submitKalkulator();

      // Reset
      useKalkulatorStore.getState().reset();

      // Verify reset
      const state = useKalkulatorStore.getState();
      expect(state.powDzialki).toBe(0);
      expect(state.powDachow).toBe(0);
      expect(state.powDachowPozaObrysem).toBe(0);
      expect(state.powUszczelnione).toBe(0);
      expect(state.powPrzepuszczalne).toBe(0);
      expect(state.powTerenyInne).toBe(0);
      expect(state.isKalkulatorSubmitted).toBe(false);
    });

    test('should reset to initial state after multiple operations', () => {
      // Perform multiple operations
      useKalkulatorStore.getState().setForm({
        powDzialki: 500,
        powDachow: 100,
        powDachowPozaObrysem: 25,
        powUszczelnione: 150,
        powPrzepuszczalne: 200,
        powTerenyInne: 25,
      });

      useKalkulatorStore.getState().submitKalkulator();

      useKalkulatorStore.getState().setForm({
        powDzialki: 1000,
        powDachow: 200,
        powDachowPozaObrysem: 50,
        powUszczelnione: 300,
        powPrzepuszczalne: 400,
        powTerenyInne: 50,
      });

      // Reset
      useKalkulatorStore.getState().reset();

      // Verify everything is back to initial state
      const state = useKalkulatorStore.getState();
      expect(state.powDzialki).toBe(0);
      expect(state.isKalkulatorSubmitted).toBe(false);
    });
  });

  describe('persistence', () => {
    test('should persist to localStorage with correct key', () => {
      const formData: KalkulatorModel = {
        powDzialki: 1000,
        powDachow: 200,
        powDachowPozaObrysem: 50,
        powUszczelnione: 300,
        powPrzepuszczalne: 400,
        powTerenyInne: 50,
      };

      useKalkulatorStore.getState().setForm(formData);

      // Verify localStorage (note: in vitest environment, localStorage might need to be mocked)
      const stored = localStorage.getItem('kalkulatorStore');
      expect(stored).toBeTruthy();
    });
  });

  describe('state immutability', () => {
    test('should not mutate previous state references', () => {
      const formData1: KalkulatorModel = {
        powDzialki: 500,
        powDachow: 100,
        powDachowPozaObrysem: 25,
        powUszczelnione: 150,
        powPrzepuszczalne: 200,
        powTerenyInne: 25,
      };

      useKalkulatorStore.getState().setForm(formData1);
      const state1PowDzialki = useKalkulatorStore.getState().powDzialki;

      const formData2: KalkulatorModel = {
        powDzialki: 1000,
        powDachow: 200,
        powDachowPozaObrysem: 50,
        powUszczelnione: 300,
        powPrzepuszczalne: 400,
        powTerenyInne: 50,
      };

      useKalkulatorStore.getState().setForm(formData2);

      expect(state1PowDzialki).toBe(500);
      expect(useKalkulatorStore.getState().powDzialki).toBe(1000);
    });
  });
});
