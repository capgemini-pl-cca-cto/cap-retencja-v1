import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DzialkaModel, InwestycjaModel } from '@/types/inwestycja-model';

interface InwestycjaStore extends InwestycjaModel {
  setForm: (data: InwestycjaModel) => void;
  reset: () => void;
  daneDzialki: DzialkaModel | undefined;
  setDaneDzialki: (data: DzialkaModel | undefined) => void;
  mapScreenshot: string | undefined;
  setMapScreenshot: (screenshot: string | undefined) => void;
  isInwestycjaSubmitted: boolean;
  submitInwestycja: () => void;
}

const initialInwestycjaState: InwestycjaModel & {
  daneDzialki: undefined;
  mapScreenshot: undefined;
  isInwestycjaSubmitted: boolean;
} = {
  nazwaInwestycji: '',
  identyfikatorInwestycji: '',
  typZabudowy: 'jednorodzinna',
  isPodlaczony: 'nie',
  isIstniejacePolaczenie: 'nie',
  daneDzialki: undefined,
  mapScreenshot: undefined,
  isInwestycjaSubmitted: false,
};

export const useInwestycjaStore = create<InwestycjaStore>()(
  persist(
    (set) => ({
      ...initialInwestycjaState,
      setForm: (data) => set({ ...data }),
      setDaneDzialki: (data) => set({ daneDzialki: data }),
      setMapScreenshot: (screenshot) => set({ mapScreenshot: screenshot }),
      submitInwestycja: () => set({ isInwestycjaSubmitted: true }),
      reset: () => set({ ...initialInwestycjaState }),
    }),
    {
      name: 'inwestycjaStore',
    },
  ),
);
