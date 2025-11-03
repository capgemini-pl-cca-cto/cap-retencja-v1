import InfoBox from '@/components/shared/info-box';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { RaportModel } from '@/types/raport-model';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import generatePDFReport from '../services/generate-PDF-report';
import findZlewnia from '../services/zlewnia-finder';

type RaportFormModel = {
  pole1: number;
  pole2: number;
};

interface RaportFormProps {
  isKalkulatorAccordionOpen: boolean;
  daneRaport: RaportModel;
  onFormReset: () => void;
}

export default function RaportForm({
  isKalkulatorAccordionOpen,
  onFormReset,
  daneRaport,
}: RaportFormProps) {
  const sumaPowierzchni =
    daneRaport.daneKalkulator.powDachow +
    daneRaport.daneKalkulator.powDachowPozaObrysem +
    daneRaport.daneKalkulator.powUszczelnione +
    daneRaport.daneKalkulator.powPrzepuszczalne;

  const [isPrzeciazona, setIsPrzeciazona] = useState(false);
  const [nazwaZlewni, setNazwaZlewni] = useState('-');

  // Calculate values only after isPrzeciazona state is determined
  const { objBZI, objDetencyjnych } = useMemo(() => {
    function calculateObjBZI(isPrzeciazona: boolean): number {
      if (daneRaport.inwestycja.typZabudowy === 'jednorodzinna') {
        return sumaPowierzchni * 0.06;
      }

      if (daneRaport.inwestycja.isPodłączony === 'nie') {
        return sumaPowierzchni * 0.06;
      }

      // isPodłączony === 'tak'
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
    daneRaport.inwestycja.isPodłączony,
  ]);

  const form = useForm<RaportFormModel>({
    defaultValues: {
      pole1: objBZI,
      pole2: objDetencyjnych,
    },
  });

  function onSubmit() {
    generatePDFReport({
      nazwaInwestycji: daneRaport.inwestycja.nazwaInwestycji,
      identyfikatorInwestycji: daneRaport.inwestycja.identyfikatorInwestycji,
      nazwaZlewni,
      powDzialki: daneRaport.daneKalkulator.powDzialki,
      powDachow: daneRaport.daneKalkulator.powDachow,
      powDachowPozaObrysem: daneRaport.daneKalkulator.powDachowPozaObrysem,
      powUszczelnione: daneRaport.daneKalkulator.powUszczelnione,
      powPrzepuszczalne: daneRaport.daneKalkulator.powPrzepuszczalne,
      powTerenyInne: daneRaport.daneKalkulator.powTerenyInne,
      objBZI,
      objDetencyjnych,
      mapScreenshot: daneRaport.mapScreenshot,
    });
  }

  useEffect(() => {
    const findAndLogZlewnia = async function () {
      if (
        daneRaport.inwestycja.typZabudowy === 'jednorodzinna' ||
        daneRaport.inwestycja.isPodłączony === 'nie'
      ) {
        setIsPrzeciazona(false);
        setNazwaZlewni('-');
        return;
      }
      // Only call API if typZabudowy !== 'jednorodzinna' and isPodłączony === 'tak'
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
    };

    findAndLogZlewnia();
  }, [
    daneRaport.daneDzialki,
    daneRaport.inwestycja.typZabudowy,
    daneRaport.inwestycja.isPodłączony,
  ]);

  return (
    <Form {...form}>
      {isKalkulatorAccordionOpen && (
        <div
          style={{ height: '1px', backgroundColor: 'var(--primary-blue)' }}
          className="w-[794px] max-sm:w-full max-lg:w-[90%] mx-auto"
        />
      )}
      <form
        className="w-[794px] max-sm:w-full max-lg:w-[90%] space-y-6 mx-auto"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormItem className="flex max-sm:flex-col justify-between max-sm:gap-2 gap-13">
          <FormLabel className="font-bold">
            Wymagana objętość obiektów błękitno-zielonej{' '}
            <br className="hidden sm:inline" />
            infrastruktury BZI [m3]
          </FormLabel>
          <FormControl>
            <Input
              disabled
              value={objBZI.toFixed(2)}
              className="font-bold text-right w-[285px] max-sm:w-full"
            />
          </FormControl>
        </FormItem>
        <p className="font-light w-full mx-auto text-center">LUB</p>
        <FormItem className="flex max-sm:flex-col justify-between max-sm:gap-2 gap-13">
          <FormLabel className="font-bold">
            Wymagana objętość obiektów detencyjnych [m3]
          </FormLabel>
          <FormControl>
            <Input
              disabled
              value={objDetencyjnych.toFixed(2)}
              className="font-bold text-right w-[285px] max-sm:w-full"
            />
          </FormControl>
        </FormItem>
        <InfoBox label="Wody opadowe możesz zagospodarować w obiektach BZI lub zbiornikach detencyjnych. Obiekty BZI to opcja rekomendowana przez Miasto Poznań. Zbiorniki detencyjne zaleca się wyłącznie jako rozwiązanie uzupełniające, lub w przypadku braku technicznych lub przestrzennych możliwości wdrożenia rozwiązań opartych na przyrodzie." />
        <p className="font-light">
          Nie wiesz jak zagospodarować wody odpadowe? <br />
          Sprawdź{' '}
          <a
            className="font-medium underline"
            href="https://www.aquanet-retencja.pl/retencja/"
            target="_blank"
            rel="noreferrer noopener"
          >
            katalogi metod zagospodarowania wód opadowych.
          </a>
        </p>
        <div className="flex justify-end gap-4 mt-8 max-sm:flex-col max-sm:justify-center max-sm:gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              form.reset();
              onFormReset();
            }}
          >
            Zacznij od nowa
          </Button>
          <Button type="submit">Pobierz raport pdf</Button>
        </div>
      </form>
    </Form>
  );
}
