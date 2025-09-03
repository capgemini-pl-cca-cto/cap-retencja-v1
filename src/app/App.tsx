import { useState } from 'react';
import { Accordion } from '@/components/ui/accordion';
import { InwestycjaSection } from '@/features/inwestycja/components/inwestycja-section';
import './App.css';
import Introduction from './Introduction';
import { BilansSection } from '@/features/kalkulator/components/bilans-section';
import RaportForm from '@/features/raport/components/raport-form';

function App() {
  const [isInwestycjaSubmitted, setIsInwestycjaSubmitted] = useState(false);
  const [isBilansSubmitted, setIsBilansSubmitted] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | undefined>(
    undefined,
  );

  function handleInwestycjaSubmit() {
    setIsInwestycjaSubmitted(true);
  }

  function handleBilansSubmit() {
    setIsBilansSubmitted(true);
  }

  return (
    <main className="text-primary-blue flex flex-col justify-start my-15">
      <Introduction />

      <div className="w-full flex flex-col justify-center py-4 font-medium gap-8">
        {/* INWESTYCJA MODULE */}
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="iwestycja-section"
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
          defaultValue={isInwestycjaSubmitted ? 'bilans-section' : undefined}
          value={openAccordion}
          onValueChange={setOpenAccordion}
        >
          <BilansSection
            disabled={!isInwestycjaSubmitted}
            onFormSubmit={handleBilansSubmit}
            isBilansSubmitted={isBilansSubmitted}
          />
        </Accordion>

        {/* RAPORT MODULE */}
        {isBilansSubmitted && (
          <RaportForm
            isBilansAccordionOpen={openAccordion === 'bilans-section'}
          />
        )}
      </div>
    </main>
  );
}

export default App;
