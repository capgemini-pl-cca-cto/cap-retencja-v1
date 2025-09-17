import { useKalkulatorStore } from './kalkulator-store';
import { useInwestycjaStore } from './inwestycja-store';
import { useSubmissionStore } from './submission-store';

export function resetAllStores() {
  useKalkulatorStore.getState().reset();
  useInwestycjaStore.getState().reset();
  useSubmissionStore.getState().reset();
}
