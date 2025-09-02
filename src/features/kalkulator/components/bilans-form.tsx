import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { BilansFormSchema, type BilansModel } from '../schemas';
import InfoBox from '@/components/shared/InfoBox';
import FormCollapsible from '@/components/shared/FormCollapsible';
import BilansInput from './BilansFormInput';

export default function BilansForm() {
  const form = useForm<BilansModel>({
    resolver: zodResolver(BilansFormSchema),
    defaultValues: {
      powDzialki: 0,
      powDachow: 0,
      powDachowPozaObrysem: 0,
      powUszczelnione: 0,
      powPrzepuszczalne: 0,
      powTerenyInne: 0,
    },
  });

  function onSubmit(data: BilansModel) {
    alert(`Form submitted successfully! \n ${JSON.stringify(data, null, 2)}`);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-[794px] space-y-6"
      >
        <InfoBox label="Wpisz powierzchnie z dokładnością do dwóch miejsc po przecinku, np. 1200,60 m2." />
        <p className="font-light">
          Zastanawiasz się, jak przypisać odpowiednie powierzchnie? <br />
          Sprawdź nasz{' '}
          <strong className="font-medium underline">załącznik graficzny</strong>
          .
        </p>
        <BilansInput
          control={form.control}
          name="powDzialki"
          label="P0. Powierzchnia działki inwestycyjnej zgodnie z Planem Zagospodarowania Terenu [m2]"
        />
        <BilansInput
          control={form.control}
          name="powDachow"
          label="P1. Powierzchnia dachów [m2]"
          subLabel="Bez powierzchni dachów/stropów nad halą garażową."
        />
        <BilansInput
          control={form.control}
          name="powDachowPozaObrysem"
          label="P2. Powierzchnia dachów/stropów nad halą garażową zlokalizowaną poza obrysem budynku [m2]"
        />
        <div className="flex flex-col gap-4">
          <BilansInput
            control={form.control}
            name="powUszczelnione"
            label="P3. Powierzchnie uszczelnione zlokalizowane poza powierzchnią P2 i P5 [m2]"
          />
          <FormCollapsible
            title="Co zalicza się do "
            titleBold="powierzchni uszczelnionych"
          >
            <ul className="list-disc pl-4 font-light">
              <li className="[&::marker]:text-xs ml-2 pl-1">
                powierzchnie dachów (w tym tarasów, balkonów)
              </li>
              <li className="[&::marker]:text-xs ml-2 pl-1">
                powierzchnie szczelne dróg, placów i chodników, w szczególności
                powierzchnie betonowe, asfaltowe
              </li>
              <li className="[&::marker]:text-xs ml-2 pl-1">
                powierzchnie częściowo przepuszczalne placów i chodników z
                kostki brukowej lub płytek chodnikowych jeżeli wody opadowe i
                roztopowe z tych powierzchni są odprowadzane bezpośrednio (za
                pośrednictwem przyłącza) lub pośrednio (spływ do sieci
                kanalizacyjnej odprowadzającej wodę z jezdni) do sieci
                kanalizacyjnej odprowadzającej te wody.
              </li>
            </ul>
          </FormCollapsible>
        </div>
        <div className="flex flex-col gap-4">
          <BilansInput
            control={form.control}
            name="powPrzepuszczalne"
            label="P4. Powierzchnie przepuszczalne zlokalizowane poza powierzchnią P2 i P5 [m2]"
          />
          <FormCollapsible
            title="Czym są "
            titleBold="powierzchnie przepuszczalne"
          >
            <p>
              Powierzchnie przepuszczalne to nawierzchnie wodoprzepuszczalne
              posadowione na gruncie rodzimym np. płyty ażurowe, kostki betonowe
              typu: „eko-kostki”, ekologiczne nawierzchnie wodoprzepuszczalne,
              kora lub żwir.
            </p>
          </FormCollapsible>
        </div>

        <div className="flex flex-col gap-4">
          <BilansInput
            control={form.control}
            name="powTerenyInne"
            label="P5. Powierzchnia terenów innych, w tym zieleni nieurządzonej [m2]"
          />
          <FormCollapsible
            title="Czym są "
            titleBold="tereny inne, w tym zieleń nieurządzona"
          >
            <p>
              Powierzchnie terenów innych, w tym zieleni nieurządzonej, są to
              pozostałe tereny tzw. dziewicze, niezabudowane i nieurządzone,
              posiadające naturalne zagłębienia terenu, nieregularny kształt.
              Tereny te są zazwyczaj porośnięte zielenią (dzikie drzewa, krzewy
              i trawy). Takie tereny posiadają często tzw. neutralność
              hydrologiczną, czyli woda opadowa i roztopowa, która spadnie na
              taki teren, jest na nim w 100% zagospodarowana: wykorzystana przez
              roślinność, wyparowuje do atmosfery oraz przenika w głąb profilu
              glebowego zasilając wody przypowierzchniowe i gruntowe.
            </p>
          </FormCollapsible>
        </div>
      </form>
    </Form>
  );
}
