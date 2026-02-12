import { useEffect, useMemo, useState } from 'react';
import type { RaportModel } from '@/types/raport-model';
import findZlewnia from '../services/zlewnia-finder';

interface RaportCalculations {
  objBZI: number;
  objDetencyjnych: number;
  nazwaZlewni: string;
}

export function useRaportCalculations(
  daneRaport: RaportModel,
): RaportCalculations {
  const [isPrzeciazona, setIsPrzeciazona] = useState(false);
  const [nazwaZlewni, setNazwaZlewni] = useState(
    'Nie wybrano podłączenia do kanalizacji deszczowej',
  );

  const sumaPowierzchni =
    daneRaport.daneKalkulator.powDachow +
    daneRaport.daneKalkulator.powDachowPozaObrysem +
    daneRaport.daneKalkulator.powUszczelnione +
    daneRaport.daneKalkulator.powPrzepuszczalne;

  // Calculate values only after isPrzeciazona state is determined
  const { objBZI, objDetencyjnych } = useMemo(() => {
    function calculateObjBZI(isPrzeciazona: boolean): number {
      if (daneRaport.inwestycja.typZabudowy === 'jednorodzinna') {
        return sumaPowierzchni * 0.06;
      }

      if (daneRaport.inwestycja.isPodlaczony === 'nie') {
        return sumaPowierzchni * 0.06;
      }

      // isPodlaczony === 'tak'
      return isPrzeciazona ? sumaPowierzchni * 0.04 : sumaPowierzchni * 0.03;
    }

    const bzi = calculateObjBZI(isPrzeciazona);
    return {
      objBZI: bzi,
      objDetencyjnych: bzi * 2,
    };
  }, [
    isPrzeciazona,
    sumaPowierzchni,
    daneRaport.inwestycja.typZabudowy,
    daneRaport.inwestycja.isPodlaczony,
  ]);

  useEffect(() => {
    async function findDaneZlewni() {
      if (
        daneRaport.inwestycja.typZabudowy === 'jednorodzinna' ||
        daneRaport.inwestycja.isPodlaczony === 'nie'
      ) {
        setIsPrzeciazona(false);
        setNazwaZlewni('Nie wybrano podłączenia do kanalizacji deszczowej');
        return;
      }
      // Only call API if typZabudowy !== 'jednorodzinna' and isPodlaczony === 'tak'
      const zlewnia = await findZlewnia(
        daneRaport.daneDzialki!.centerCoordinates,
      );
      if (zlewnia) {
        setNazwaZlewni(zlewnia.nazwaZlewni);
        if (zlewnia.isPrzeciazona === true) {
          setIsPrzeciazona(true);
        } else {
          setIsPrzeciazona(false);
        }
      } else {
        console.log('Działka nie znajduje się w żadnej zlewni.');
      }
    }

    findDaneZlewni();
  }, [
    daneRaport.daneDzialki,
    daneRaport.inwestycja.typZabudowy,
    daneRaport.inwestycja.isPodlaczony,
  ]);

  return {
    objBZI,
    objDetencyjnych,
    nazwaZlewni,
  };
}
