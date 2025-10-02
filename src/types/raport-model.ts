import type { DzialkaModel, InwestycjaModel } from './inwestycja-model';
import type { KalkulatorModel } from './kalkulator-model';

export type RaportModel = {
  inwestycja: InwestycjaModel;
  daneDzialki: DzialkaModel;
  mapScreenshot: string | undefined;
  daneKalkulator: KalkulatorModel;
};
