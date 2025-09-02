import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { InwestycjaFormSchema, type InwestycjaModel } from '../schemas';
import FormInput from './FormInput';
import FormCollapsible from '@/components/shared/FormCollapsible';
import FormRadio from './FormRadio';
import InfoBox from '@/components/shared/InfoBox';

export function InwestycjaForm() {
  const form = useForm<InwestycjaModel>({
    resolver: zodResolver(InwestycjaFormSchema),
    defaultValues: {
      nazwaInwestycji: '',
      identyfikatorInwestycji: '',
      typZabudowy: 'jednorodzinna',
      isPodłączony: 'tak',
    },
  });

  const typZabudowy = form.watch('typZabudowy');

  function onSubmit(data: InwestycjaModel) {
    alert(`Form submitted successfully! \n ${JSON.stringify(data, null, 2)}`);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-[794px] space-y-6"
      >
        <FormInput
          control={form.control}
          name="nazwaInwestycji"
          label="Nazwa inwestycji"
        />
        <FormInput
          control={form.control}
          name="identyfikatorInwestycji"
          label="Identyfikator działki inwestycyjnej"
          description="Wpisz identyfikator w formacie WWPPGG_R.OOOO.AR_NR.DZ lub wskaż
                miejsce na mapie"
          showMapIcon={true}
        />
        <FormCollapsible
          title="Co składa się na "
          titleBold="identyfikator działki"
        >
          <div className="flex flex-col gap-2">
            <div>
              <span>
                Format identyfikatora działki to{' '}
                <strong className="font-medium">
                  “WWPPGG_R.OOOO.AR_NR.NDZ”
                </strong>
                :
              </span>
              <ul className="list-disc list-inside pl-4 font-light">
                <li className="[&::marker]:text-xs">
                  WWPPGG_R - (WW - województwo, PP - powiat, GG - gmina, R - typ
                  gminy)
                </li>
                <li className="[&::marker]:text-xs">
                  OOOO - oznaczenie obrębu ewidencyjnego
                </li>
                <li className="[&::marker]:text-xs">
                  AR_NR - oznaczenie arkusza mapy, o ile występuje (NR numer
                  arkusza)
                </li>
                <li className="[&::marker]:text-xs">NDZ - numer działki</li>
              </ul>
            </div>

            <span className="font-light">
              Identyfikator w takim formacie można znaleźć na platformie{' '}
              <a
                href="https://mapy.geoportal.gov.pl/imap/Imgp_2.html?gpmap=gp0"
                className="font-medium underline"
                target="_blank"
                rel="noreferrer noopener"
              >
                Geoportal krajowy.
              </a>
            </span>
          </div>
        </FormCollapsible>
        <FormRadio
          control={form.control}
          name="typZabudowy"
          mainLabel="Typ planowanej zabudowy"
          values={['jednorodzinna', 'wielorodzinna']}
          inputLabels={[
            'jednorodzinna',
            'wielorodzinna / usługowa / przemysłowa',
          ]}
        />
        {typZabudowy === 'jednorodzinna' ? (
          <InfoBox
            label="W przypadku zabudowy jednorodzinnej nie ma możliwości podłączenia
              się do kanalizacji deszczowej."
          />
        ) : (
          <FormRadio
            control={form.control}
            name="isPodłączony"
            mainLabel="Czy chcesz podłączyć się do sieci kanalizacji deszczowej lub, gdy masz już przyłącze, chcesz pozostać podłączony?"
            values={['tak', 'nie']}
            inputLabels={['tak', 'nie']}
          />
        )}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => form.reset()}
          >
            Wyczyść dane
          </Button>
          <Button type="submit">Zatwierdź</Button>
        </div>
      </form>
    </Form>
  );
}
