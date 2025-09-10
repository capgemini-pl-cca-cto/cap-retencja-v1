import { useKalkulatorStore } from '../features/kalkulator/stores/kalkulatorStore';
import { useInwestycjaStore } from '../features/inwestycja/stores/inwestycjaStore';
import { useSubmissionStore } from './submissionStore';

export function resetAllStores() {
  useKalkulatorStore.getState().reset();
  useInwestycjaStore.getState().reset();
  useSubmissionStore.getState().reset();
}
