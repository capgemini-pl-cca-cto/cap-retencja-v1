import { useKalkulatorStore } from './kalkulatorStore';
import { useInwestycjaStore } from './inwestycjaStore';
import { useSubmissionStore } from './submissionStore';

export function resetAllStores() {
  useKalkulatorStore.getState().reset();
  useInwestycjaStore.getState().reset();
  useSubmissionStore.getState().reset();
}
