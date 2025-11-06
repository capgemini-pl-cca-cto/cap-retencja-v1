import { useInwestycjaStore } from '@/features/inwestycja/stores/inwestycja-store';
import { useKalkulatorStore } from '@/features/kalkulator/stores/kalkulator-store';
import type { RaportModel } from '@/types/raport-model';

export function resetAllStores() {
  useKalkulatorStore.getState().reset();
  useInwestycjaStore.getState().reset();
}

export function useDaneRaport() {
  const {
    nazwaInwestycji,
    typZabudowy,
    isPodlaczony,
    isIstniejacePolaczenie,
    daneDzialki,
    identyfikatorInwestycji,
    mapScreenshot,
  } = useInwestycjaStore();
  const {
    powDzialki,
    powDachow,
    powDachowPozaObrysem,
    powUszczelnione,
    powPrzepuszczalne,
    powTerenyInne,
  } = useKalkulatorStore();

  const daneRaport: RaportModel = {
    inwestycja: {
      nazwaInwestycji,
      typZabudowy,
      isPodlaczony,
      isIstniejacePolaczenie,
      identyfikatorInwestycji,
    },
    daneDzialki: daneDzialki!,
    mapScreenshot,
    daneKalkulator: {
      powDzialki,
      powDachow,
      powDachowPozaObrysem,
      powUszczelnione,
      powPrzepuszczalne,
      powTerenyInne,
    },
  };

  return daneRaport;
}
