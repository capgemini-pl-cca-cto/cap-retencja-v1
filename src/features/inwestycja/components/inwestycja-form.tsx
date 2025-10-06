import FormCollapsible from '@/components/shared/form-collapsible';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { InwestycjaFormSchema } from '../schemas';
import { fetchDzialkaData } from '../services/dzialka-parser';
import FormInput from './form-input';
import KanalizacjaDeszczowa from './kanalizacja-deszczowa';
import PodgladLokalizacji from './podglad-lokalizacji';
import TypZabudowy from './typ-zabudowy';
import { useInwestycjaStore } from '../stores/inwestycja-store';
import type { InwestycjaModel } from '@/types/inwestycja-model';
import PodgladMapModal from './podglad-map-modal';

interface InwestycjaFormProps {
  isInwestycjaSubmitted: boolean;
  onFormSubmit: () => void;
}

export function InwestycjaForm({
  isInwestycjaSubmitted,
  onFormSubmit,
}: InwestycjaFormProps) {
  const {
    nazwaInwestycji,
    identyfikatorInwestycji,
    typZabudowy,
    isPodłączony,
    setForm,
    daneDzialki,
    setDaneDzialki,
    reset,
  } = useInwestycjaStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isPodgladMapOpen, setIsPodgladMapOpen] = useState(false);

  const form = useForm<InwestycjaModel>({
    resolver: zodResolver(InwestycjaFormSchema),
    defaultValues: {
      nazwaInwestycji,
      identyfikatorInwestycji,
      typZabudowy,
      isPodłączony,
    },
  });

  useEffect(() => {
    form.reset({
      nazwaInwestycji,
      identyfikatorInwestycji,
      typZabudowy,
      isPodłączony,
    });
  }, [
    form,
    nazwaInwestycji,
    identyfikatorInwestycji,
    typZabudowy,
    isPodłączony,
  ]);

  // Callback to set identyfikatorInwestycji from Map
  function setIdentyfikatorFromMap(value: string) {
    form.setValue('identyfikatorInwestycji', value);
  }

  const watchedTypZabudowy = form.watch('typZabudowy');
  const watchedIsPodłączony = form.watch('isPodłączony');

  async function onSubmit(data: InwestycjaModel) {
    setIsLoading(true);
    try {
      const fetchedData = await fetchDzialkaData(data.identyfikatorInwestycji);
      setDaneDzialki(fetchedData);
      setForm(data);
      onFormSubmit();
      setIsLoading(false);
      setIsPodgladMapOpen(true);
    } catch (error) {
      form.setError('identyfikatorInwestycji', {
        type: 'manual',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
      setIsLoading(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[794px] space-y-6"
        >
          <FormInput
            control={form.control}
            name="nazwaInwestycji"
            label="Nazwa inwestycji"
            isInwestycjaSubmitted={isInwestycjaSubmitted}
          />
          <div className="flex flex-col gap-4">
            <FormInput
              control={form.control}
              name="identyfikatorInwestycji"
              label="Identyfikator działki inwestycyjnej"
              isInwestycjaSubmitted={isInwestycjaSubmitted}
              description="Wpisz identyfikator w formacie WWPPGG_R.OOOO.AR_NR.DZ lub wskaż
                miejsce na mapie"
              showMapIcon={true}
              setIdentyfikatorFromMap={setIdentyfikatorFromMap}
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
                      WWPPGG_R - (WW - województwo, PP - powiat, GG - gmina, R -
                      typ gminy)
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
            {isInwestycjaSubmitted && (
              <PodgladLokalizacji daneDzialki={daneDzialki!} />
            )}
          </div>

          <TypZabudowy
            isInwestycjaSubmitted={isInwestycjaSubmitted}
            control={form.control}
            typZabudowy={watchedTypZabudowy}
          />
          <KanalizacjaDeszczowa
            isInwestycjaSubmitted={isInwestycjaSubmitted}
            control={form.control}
            typZabudowy={watchedTypZabudowy}
            isPodłączony={watchedIsPodłączony}
          />
          {isInwestycjaSubmitted === false && (
            <div className="flex justify-end gap-4 mt-8">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  reset();
                  form.reset();
                }}
              >
                Wyczyść dane
              </Button>
              <Button type="submit">
                {isLoading ? 'Wyszukiwanie działki...' : 'Zatwierdź'}
              </Button>
            </div>
          )}
        </form>
      </Form>
      <Dialog open={isPodgladMapOpen} onOpenChange={setIsPodgladMapOpen}>
        <DialogContent
          showCloseButton={false}
          className="!fixed !inset-0 !w-screen !h-screen !max-w-none !max-h-none !p-0 !m-0 !border-0 !rounded-none !top-0 !left-0 !translate-x-0 !translate-y-0 !grid-cols-1"
        >
          <PodgladMapModal daneDzialki={daneDzialki!} />
        </DialogContent>
      </Dialog>
    </>
  );
}
