import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SubmissionStore {
  isInwestycjaSubmitted: boolean;
  isKalkulatorSubmitted: boolean;
  submitInwestycja: () => void;
  submitKalkulator: () => void;
  reset: () => void;
}

const initialSubmissionState = {
  isInwestycjaSubmitted: false,
  isKalkulatorSubmitted: false,
};

export const useSubmissionStore = create<SubmissionStore>()(
  persist(
    (set) => ({
      ...initialSubmissionState,
      submitInwestycja: () => set({ isInwestycjaSubmitted: true }),
      submitKalkulator: () => set({ isKalkulatorSubmitted: true }),
      reset: () => set({ ...initialSubmissionState }),
    }),
    {
      name: 'submissionStore', // name in localStorage
    },
  ),
);
