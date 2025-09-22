import { useInwestycjaStore } from '@/features/inwestycja/stores/inwestycja-store';
import { useKalkulatorStore } from '@/features/kalkulator/stores/kalkulator-store';

export function resetAllStores() {
  useKalkulatorStore.getState().reset();
  useInwestycjaStore.getState().reset();
}
