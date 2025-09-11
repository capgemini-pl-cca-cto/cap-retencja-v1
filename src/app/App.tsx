import { useState } from 'react';
import { Accordion } from '@/components/ui/accordion';
import { InwestycjaSection } from '@/features/inwestycja/components/inwestycja-section';
import './App.css';
import Introduction from './Introduction';
import RaportForm from '@/features/raport/components/raport-form';
import { useSubmissionStore } from '@/store/submissionStore';
import { KalkulatorSection } from '@/features/kalkulator/components/kalkulator-section';

function App() {
  const {
    isInwestycjaSubmitted,
    isKalkulatorSubmitted,
    submitInwestycja,
    submitKalkulator,
  } = useSubmissionStore();
  const [openAccordion, setOpenAccordion] = useState<string | undefined>(
    isKalkulatorSubmitted ? 'kalkulator-section' : undefined,
  );

  return (
    <main className="text-primary-blue flex flex-col justify-start gap-8 my-15">
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
            onFormSubmit={submitInwestycja}
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
            isKalkulatorSubmitted={isKalkulatorSubmitted}
          />
        </Accordion>

        {/* RAPORT MODULE */}
        {isKalkulatorSubmitted && (
          <RaportForm
            isKalkulatorAccordionOpen={openAccordion === 'kalkulator-section'}
          />
        )}

      </div>
    </main>
  );
}

export default App;
