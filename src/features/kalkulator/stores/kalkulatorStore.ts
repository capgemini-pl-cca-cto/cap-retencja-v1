import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { KalkulatorModel } from '../schemas';

interface KalkulatorStore extends KalkulatorModel {
  setForm: (data: KalkulatorModel) => void;
  reset: () => void;
}

const initialKalkulatorState: KalkulatorModel = {
  powDzialki: 0,
  powDachow: 0,
  powDachowPozaObrysem: 0,
  powUszczelnione: 0,
  powPrzepuszczalne: 0,
  powTerenyInne: 0,
};

export const useKalkulatorStore = create<KalkulatorStore>()(
  persist(
    (set) => ({
      ...initialKalkulatorState,
      setForm: (data) => set({ ...data }),
      reset: () => set({ ...initialKalkulatorState }),
    }),
    {
      name: 'kalkulatorStore', // name in localStorage
    },
  ),
);
