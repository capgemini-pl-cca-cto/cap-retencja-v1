import { useState } from 'react';
import { Accordion } from '@/components/ui/accordion';
import { InwestycjaSection } from '@/features/inwestycja/components/inwestycja-section';
import './app.css';
import RaportForm from '@/features/raport/components/raport-form';
import { KalkulatorSection } from '@/features/kalkulator/components/kalkulator-section';
import Introduction from './introduction';
import { useKalkulatorStore } from '@/features/kalkulator/stores/kalkulator-store';
import { useInwestycjaStore } from '@/features/inwestycja/stores/inwestycja-store';
import r2wc from '@r2wc/react-to-web-component';
import { resetAllStores, useDaneRaport } from './app-store';

function App() {
  const { isInwestycjaSubmitted, submitInwestycja } = useInwestycjaStore();
  const { isKalkulatorSubmitted, submitKalkulator } = useKalkulatorStore();
  const [openAccordion, setOpenAccordion] = useState<string | undefined>(
    isKalkulatorSubmitted ? 'kalkulator-section' : undefined,
  );
  const daneRaport = useDaneRaport();

  const handleInwestycjaSubmit = () => {
    submitInwestycja();
    setOpenAccordion('kalkulator-section');
  };

  return (
    <main className="text-primary-blue flex flex-col justify-start gap-8">
      <Introduction />

      <div className="w-full flex flex-col justify-center font-medium gap-8">
        {/* INWESTYCJA MODULE */}
        <Accordion
          type="single"
          collapsible
          className="w-full group"
          defaultValue="inwestycja-section"
        >
          <InwestycjaSection
            onFormSubmit={handleInwestycjaSubmit}
            isInwestycjaSubmitted={isInwestycjaSubmitted}
          />
        </Accordion>

        {/* KALKULATOR MODULE */}
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue={
            isInwestycjaSubmitted ? 'kalkulator-section' : undefined
          }
          value={openAccordion}
          onValueChange={setOpenAccordion}
        >
          <KalkulatorSection
            disabled={!isInwestycjaSubmitted}
            onFormSubmit={submitKalkulator}
            onFormReset={resetAllStores}
            isKalkulatorSubmitted={isKalkulatorSubmitted}
          />
        </Accordion>

        {/* RAPORT MODULE */}
        {isKalkulatorSubmitted && (
          <RaportForm
            isKalkulatorAccordionOpen={openAccordion === 'kalkulator-section'}
            onFormReset={resetAllStores}
            daneRaport={daneRaport}
          />
        )}
      </div>
    </main>
  );
}

export default App;

const RetencjaApp = r2wc(App);
customElements.define('retencja-app', RetencjaApp);
