import { Accordion } from '@/components/ui/accordion';
import './App.css';
import { InwestycjaSection } from '@/features/inwestycja/components/inwestycja-section';
import type { InwestycjaModel } from '@/features/inwestycja/types/inwestycja-schema';

function App() {
  function onInwestycjaSubmit(data: InwestycjaModel) {
    alert(`Form submitted successfully! \n ${JSON.stringify(data, null, 2)}`);
  }

  return (
    <div className="w-full min-h-screen flex justify-center p-4 sm:px-6 md:px-8">
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
