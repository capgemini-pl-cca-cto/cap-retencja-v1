import { Accordion } from '@/components/ui/accordion';
import { InwestycjaSection } from '@/features/inwestycja/components/inwestycja-section';
import './App.css';
import Introduction from './Introduction';
import { BilansSection } from '@/features/kalkulator/components/bilans-section';

function App() {
  return (
    <main className="text-primary-blue flex flex-col justify-start my-15">
      <Introduction />

      <div className="w-full flex flex-col justify-center py-4 font-medium gap-8">
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="iwestycja-section"
        >
          <InwestycjaSection />
        </Accordion>
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="bilans-section"
        >
          <BilansSection />
        </Accordion>
      </div>
    </main>
  );
}

export default App;
