import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { InwestycjaModel } from '@/features/inwestycja/schemas';
import type { DzialkaData } from '../features/inwestycja/types/types';

interface InwestycjaStore extends InwestycjaModel {
  setForm: (data: InwestycjaModel) => void;
  reset: () => void;
  daneDzialki: DzialkaData | undefined;
  setDaneDzialki: (data: DzialkaData | undefined) => void;
  mapScreenshot: string | undefined;
  setMapScreenshot: (screenshot: string | undefined) => void;
}

const initialInwestycjaState: InwestycjaModel & {
  daneDzialki: undefined;
  mapScreenshot: undefined;
} = {
  nazwaInwestycji: '',
  identyfikatorInwestycji: '',
  typZabudowy: 'jednorodzinna',
  isPodłączony: 'nie',
  daneDzialki: undefined,
  mapScreenshot: undefined,
};

export const useInwestycjaStore = create<InwestycjaStore>()(
  persist(
    (set) => ({
      ...initialInwestycjaState,
      setForm: (data) => set({ ...data }),
      setDaneDzialki: (data) => set({ daneDzialki: data }),
      setMapScreenshot: (screenshot) => set({ mapScreenshot: screenshot }),
      reset: () => set({ ...initialInwestycjaState }),
    }),
    {
      name: 'inwestycjaStore',
    },
  ),
);
