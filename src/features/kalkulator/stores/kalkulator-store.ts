import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { KalkulatorModel } from '../schemas';

interface KalkulatorStore extends KalkulatorModel {
  setForm: (data: KalkulatorModel) => void;
  isKalkulatorSubmitted: boolean;
  submitKalkulator: () => void;
  reset: () => void;
}

const initialKalkulatorState: KalkulatorModel & {
  isKalkulatorSubmitted: boolean;
} = {
  powDzialki: 0,
  powDachow: 0,
  powDachowPozaObrysem: 0,
  powUszczelnione: 0,
  powPrzepuszczalne: 0,
  powTerenyInne: 0,
  isKalkulatorSubmitted: false,
};

export const useKalkulatorStore = create<KalkulatorStore>()(
  persist(
    (set) => ({
      ...initialKalkulatorState,
      setForm: (data) => set({ ...data }),
      submitKalkulator: () => set({ isKalkulatorSubmitted: true }),
      reset: () => set({ ...initialKalkulatorState }),
    }),
    {
      name: 'kalkulatorStore', // name in localStorage
    },
  ),
);
