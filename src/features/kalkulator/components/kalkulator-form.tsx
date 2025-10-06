import ErrorInfoBox from '@/components/shared/error-info-box';
import FormCollapsible from '@/components/shared/form-collapsible';
import InfoBox from '@/components/shared/info-box';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { KalkulatorFormSchema } from '../schemas';
import KalkulatorInput from './kalkulator-form-input';
import KalkulatorSumDisplay from './kalkulator-sum-display';
import { useKalkulatorStore } from '../stores/kalkulator-store';
import type { KalkulatorModel } from '@/types/kalkulator-model';

interface KalkulatorFormProps {
  onFormSubmit: () => void;
  onFormReset: () => void;
  isKalkulatorSubmitted: boolean;
}

export default function KalkulatorForm({
  onFormSubmit,
  onFormReset,
  isKalkulatorSubmitted,
}: KalkulatorFormProps) {
  const {
    powDzialki,
    powDachow,
    powDachowPozaObrysem,
    powUszczelnione,
    powPrzepuszczalne,
    powTerenyInne,
    setForm,
  } = useKalkulatorStore();

  const form = useForm<KalkulatorModel>({
    resolver: zodResolver(KalkulatorFormSchema),
    defaultValues: {
      powDzialki,
      powDachow,
      powDachowPozaObrysem,
      powUszczelnione,
      powPrzepuszczalne,
      powTerenyInne,
    },
  });

  function onSubmit(data: KalkulatorModel) {
    setForm(data);
    onFormSubmit();
  }

  // Get the global validation error from refine
  // When path: [] is used, the error is stored under an empty string key
  const errors = form.formState.errors;
  const globalError =
    errors && '' in errors
      ? (errors as Record<string, { message: string }>)[''].message
      : undefined;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-[794px] max-sm:w-full max-lg:w-[90%] space-y-8"
      >
        <div className="space-y-6 max-sm:flex max-sm:flex-col max-sm:justify-center">
          {!isKalkulatorSubmitted && (
            <InfoBox label="Wpisz powierzchnie z dokładnością do dwóch miejsc po przecinku, np. 1200,60 m2." />
          )}
          <p className="font-light max-sm:text-xs max-sm:text-center">
            Zastanawiasz się, jak przypisać odpowiednie powierzchnie? <br />
            Sprawdź nasz{' '}
            <a
              href={`${import.meta.env.BASE_URL}assets/załącznikgraficzny.pdf`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <strong className="font-medium underline">
                załącznik graficzny
              </strong>
            </a>
            .
          </p>
          <KalkulatorInput
            control={form.control}
            name="powDzialki"
            label="P0. Powierzchnia działki inwestycyjnej zgodnie z Planem Zagospodarowania Terenu [m2]"
            hasGlobalError={!!globalError}
            isKalkulatorSubmitted={isKalkulatorSubmitted}
          />
          <KalkulatorInput
            control={form.control}
            name="powDachow"
            label="P1. Powierzchnia dachów [m2]"
            subLabel="Bez powierzchni dachów/stropów nad halą garażową."
            hasGlobalError={!!globalError}
            isKalkulatorSubmitted={isKalkulatorSubmitted}
          />
          <KalkulatorInput
            control={form.control}
            name="powDachowPozaObrysem"
            label="P2. Powierzchnia dachów/stropów nad halą garażową zlokalizowaną poza obrysem budynku [m2]"
            hasGlobalError={!!globalError}
            isKalkulatorSubmitted={isKalkulatorSubmitted}
          />
          <div className="flex flex-col gap-4">
            <KalkulatorInput
              control={form.control}
              name="powUszczelnione"
              label="P3. Powierzchnie uszczelnione zlokalizowane poza powierzchnią P2 i P5 [m2]"
              hasGlobalError={!!globalError}
              isKalkulatorSubmitted={isKalkulatorSubmitted}
            />
            <div className="max-sm:text-sm">
              <FormCollapsible
                title="Co zalicza się do "
                titleBold="powierzchni uszczelnionych"
              >
                <ul className="list-disc pl-4 font-light">
                  <li className="[&::marker]:text-xs ml-2 pl-1">
                    powierzchnie dachów (w tym tarasów, balkonów)
                  </li>
                  <li className="[&::marker]:text-xs ml-2 pl-1">
                    powierzchnie szczelne dróg, placów i chodników, w
                    szczególności powierzchnie betonowe, asfaltowe
                  </li>
                  <li className="[&::marker]:text-xs ml-2 pl-1">
                    powierzchnie częściowo przepuszczalne placów i chodników z
                    kostki brukowej lub płytek chodnikowych jeżeli wody opadowe
                    i roztopowe z tych powierzchni są odprowadzane bezpośrednio
                    (za pośrednictwem przyłącza) lub pośrednio (spływ do sieci
                    kanalizacyjnej odprowadzającej wodę z jezdni) do sieci
                    kanalizacyjnej odprowadzającej te wody.
                  </li>
                </ul>
              </FormCollapsible>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <KalkulatorInput
              control={form.control}
              name="powPrzepuszczalne"
              label="P4. Powierzchnie przepuszczalne zlokalizowane poza powierzchnią P2 i P5 [m2]"
              hasGlobalError={!!globalError}
              isKalkulatorSubmitted={isKalkulatorSubmitted}
            />
            <div className="max-sm:text-sm">
              <FormCollapsible
                title="Czym są "
                titleBold="powierzchnie przepuszczalne"
              >
                <p>
                  Powierzchnie przepuszczalne to nawierzchnie wodoprzepuszczalne
                  posadowione na gruncie rodzimym np. płyty ażurowe, kostki
                  betonowe typu: „eko-kostki”, ekologiczne nawierzchnie
                  wodoprzepuszczalne, kora lub żwir.
                </p>
              </FormCollapsible>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <KalkulatorInput
              control={form.control}
              name="powTerenyInne"
              label="P5. Powierzchnia terenów innych, w tym zieleni nieurządzonej [m2]"
              hasGlobalError={!!globalError}
              isKalkulatorSubmitted={isKalkulatorSubmitted}
            />
            <div className="max-sm:text-sm">
              <FormCollapsible
                title="Czym są "
                titleBold="tereny inne"
                titleBoldHiddenOnSmall=", w tym zieleń nieurządzona"
              >
                <p>
                  Powierzchnie terenów innych, w tym zieleni nieurządzonej, są
                  to pozostałe tereny tzw. dziewicze, niezabudowane i
                  nieurządzone, posiadające naturalne zagłębienia terenu,
                  nieregularny kształt. Tereny te są zazwyczaj porośnięte
                  zielenią (dzikie drzewa, krzewy i trawy). Takie tereny
                  posiadają często tzw. neutralność hydrologiczną, czyli woda
                  opadowa i roztopowa, która spadnie na taki teren, jest na nim
                  w 100% zagospodarowana: wykorzystana przez roślinność,
                  wyparowuje do atmosfery oraz przenika w głąb profilu glebowego
                  zasilając wody przypowierzchniowe i gruntowe.
                </p>
              </FormCollapsible>
            </div>
          </div>
          {globalError && <ErrorInfoBox label={globalError} />}
        </div>
        {!isKalkulatorSubmitted && (
          <div className="flex justify-end gap-4 max-sm:flex-col max-sm:justify-center max-sm:gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                form.reset();
                onFormReset();
              }}
            >
              Zmień działkę
            </Button>
            <Button type="submit">Przelicz</Button>
          </div>
        )}
        {isKalkulatorSubmitted && (
          <KalkulatorSumDisplay
            p1={form.getValues('powDachow')}
            p2={form.getValues('powDachowPozaObrysem')}
            p3={form.getValues('powUszczelnione')}
            p4={form.getValues('powPrzepuszczalne')}
          />
        )}
      </form>
    </Form>
  );
}
