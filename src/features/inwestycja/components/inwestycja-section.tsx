import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { InwestycjaForm } from './inwestycja-form';

interface InwestycjaSectionProps {
  isInwestycjaSubmitted: boolean;
  onFormSubmit: () => void;
}

export const InwestycjaSection = ({
  isInwestycjaSubmitted,
  onFormSubmit,
}: InwestycjaSectionProps) => {
  return (
    <AccordionItem value="inwestycja-section">
      <AccordionTrigger className="text-2xl max-sm:text-xl justify-normal items-center gap-4 border-2 border-primary-blue text-primary-blue">
        1. Szczegóły inwestycji
      </AccordionTrigger>
      <AccordionContent className="flex flex-col text-balance items-center">
        <InwestycjaForm
          onFormSubmit={onFormSubmit}
          isInwestycjaSubmitted={isInwestycjaSubmitted}
        />
      </AccordionContent>
    </AccordionItem>
  );
};
