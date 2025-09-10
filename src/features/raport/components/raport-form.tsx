import { Form, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import InfoBox from '@/components/shared/InfoBox';
import { Button } from '@/components/ui/button';
import { resetAllStores } from '@/store/appStore';

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
  const form = useForm<RaportFormModel>({
    defaultValues: {
      pole1: 123.45,
      pole2: 678.9,
    },
  });

  return (
    <Form {...form}>
      {isKalkulatorAccordionOpen && (
        <div
          style={{ height: '1px', backgroundColor: 'var(--primary-blue)' }}
          className="w-[794px] mx-auto"
        />
      )}
      <form className="w-[794px] space-y-6 mx-auto">
        <FormItem className="flex justify-between gap-13">
          <FormLabel className="font-bold">
            Wymagana objętość obiektów błękitno-zielonej <br />
            infrastruktury BZI [m3]
          </FormLabel>
          <FormControl>
            <Input
              disabled
              value={form.watch('pole1')}
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
              value={form.watch('pole2')}
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
