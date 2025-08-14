import { Accordion } from '@/components/ui/accordion';
import './App.css';
import { InwestycjaSection } from '@/features/inwestycja/components/inwestycja-section';
import type { InwestycjaModel } from '@/features/inwestycja/types/inwestycja-schema';
import { InfoBox } from '@/components/info-box';
import { TextWithLinks } from '@/components/text-with-links';

function App() {
  function onInwestycjaSubmit(data: InwestycjaModel) {
    alert(`Form submitted successfully! \n ${JSON.stringify(data, null, 2)}`);
  }

  return (
    <div className="w-full min-h-screen flex-col justify-center p-4 grid gap-4 sm:px-6 md:px-8">
      <section className="w-2/3 grid gap-2">
        <h1 className="underline decoration-green-700 decoration-6 font-bold text-xl/9 text-primary-blue">
          Kalkulator
        </h1>
        <h2 className="text-primary-blue font-bold">
          Sprawdź, ile deszczu gromadzisz na terenie swojej nieruchomości.
        </h2>
        <TextWithLinks
          description="Więcej informacji o programie i wymogach obliczeniowych znajdziesz pod linkami:"
          linkOne="trzeba-uzupelnic-link"
          linkOneLabel="Standard Retencji dla Miasta Poznania"
          linkTwo="trzeba-uzupelnic-link"
          linkTwoLabel='Program dotacyjny UM "Mała retencja"'
        ></TextWithLinks>
        <InfoBox description="Niniejsze obliczenia i wynik wymaganej pojemności wodnej są szacunkowe. W celu ustalenia szczegółów np. lokalizacji nieruchomości w danej zlewni, zgłoś się z wnioskiem do Aquanet Retencja."></InfoBox>
      </section>
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="inwestycja-section"
      >
        <InwestycjaSection onSubmit={onInwestycjaSubmit} />
      </Accordion>
    </div>
  );
}

export default App;
