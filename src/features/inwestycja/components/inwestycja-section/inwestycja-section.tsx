import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { InwestycjaForm } from '../inwestycja-form';
import type { InwestycjaModel } from '../../types/inwestycja-schema';

export type InwestycjaSectionProps = {
  onSubmit: (data: InwestycjaModel) => void;
};

export const InwestycjaSection = ({ onSubmit }: InwestycjaSectionProps) => {
  return (
    <AccordionItem value="iwestycja-section">
      <AccordionTrigger className="text-2xl justify-normal items-center gap-4 border-2 border-primary-blue text-primary-blue">
        1. Szczegóły inwestycji
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-4 text-balance items-center">
        <InwestycjaForm onSubmit={onSubmit} />
      </AccordionContent>
    </AccordionItem>
  );
};
