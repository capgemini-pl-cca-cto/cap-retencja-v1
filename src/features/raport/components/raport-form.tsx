import InfoBox from '@/components/shared/InfoBox';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { resetAllStores } from '@/store/appStore';
import { useInwestycjaStore } from '@/store/inwestycjaStore';
import { useKalkulatorStore } from '@/store/kalkulatorStore';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import findZlewnia from '../utils';
import generatePDFReport from '../generatePDFReport';

type RaportFormModel = {
  pole1: number;
  pole2: number;
};

interface RaportFormProps {
  isKalkulatorAccordionOpen: boolean;
}

export default function RaportForm({
  isKalkulatorAccordionOpen,
}: RaportFormProps) {
  const {
    nazwaInwestycji,
    typZabudowy,
    isPodłączony,
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
  const sumaPowierzchni =
    powDachow + powDachowPozaObrysem + powUszczelnione + powPrzepuszczalne;
  const [isPrzeciazona, setIsPrzeciazona] = useState(false);
  const [nazwaZlewni, setNazwaZlewni] = useState('-');

  // Calculate values only after isPrzeciazona state is determined
  const { objBZI, objDetencyjnych } = useMemo(() => {
    function calculateObjBZI(isPrzeciazona: boolean): number {
      if (typZabudowy === 'jednorodzinna') {
        return sumaPowierzchni * 0.06;
      }

      if (isPodłączony === 'nie') {
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
  }, [isPrzeciazona, sumaPowierzchni, typZabudowy, isPodłączony]);

  const form = useForm<RaportFormModel>({
    defaultValues: {
      pole1: objBZI,
      pole2: objDetencyjnych,
    },
  });

  function onSubmit() {
    generatePDFReport({
      nazwaInwestycji,
      identyfikatorInwestycji,
      nazwaZlewni,
      powDzialki,
      powDachow,
      powDachowPozaObrysem,
      powUszczelnione,
      powPrzepuszczalne,
      powTerenyInne,
      objBZI,
      objDetencyjnych,
      mapScreenshot,
    });
  }

  useEffect(() => {
    const findAndLogZlewnia = async function () {
      if (typZabudowy === 'jednorodzinna' || isPodłączony === 'nie') {
        setIsPrzeciazona(false);
        setNazwaZlewni('-');
        return;
      }
      // Only call API if typZabudowy !== 'jednorodzinna' and isPodłączony === 'tak'
      const zlewnia = await findZlewnia(daneDzialki!.coordinates);
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
  }, [daneDzialki, typZabudowy, isPodłączony]);

  return (
    <Form {...form}>
      {isKalkulatorAccordionOpen && (
        <div
          style={{ height: '1px', backgroundColor: 'var(--primary-blue)' }}
          className="w-[794px] mx-auto"
        />
      )}
      <form
        className="w-[794px] space-y-6 mx-auto"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormItem className="flex justify-between gap-13">
          <FormLabel className="font-bold">
            Wymagana objętość obiektów błękitno-zielonej <br />
            infrastruktury BZI [m3]
          </FormLabel>
          <FormControl>
            <Input
              disabled
              value={objBZI.toFixed(2)}
              className="font-bold text-right w-[285px]"
            />
          </FormControl>
        </FormItem>
        <p className="font-light w-full mx-auto text-center">LUB</p>
        <FormItem className="flex justify-between gap-13">
          <FormLabel className="font-bold">
            Wymagana objętość obiektów detencyjnych [m3]
          </FormLabel>
          <FormControl>
            <Input
              disabled
              value={objDetencyjnych.toFixed(2)}
              className="font-bold text-right w-[285px]"
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
        <div className="flex justify-end gap-4 mt-8">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              form.reset();
              resetAllStores();
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
