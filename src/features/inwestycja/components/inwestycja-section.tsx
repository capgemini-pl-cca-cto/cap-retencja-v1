import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { InwestycjaForm } from './inwestycja-form';

export const InwestycjaSection = () => {
  return (
    <AccordionItem value="iwestycja-section">
      <AccordionTrigger className="text-2xl justify-normal items-center gap-4 border-2 border-primary-blue text-primary-blue">
        1. Szczegóły inwestycji
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-4 text-balance items-center">
        <InwestycjaForm />
      </AccordionContent>
    </AccordionItem>
  );
};
