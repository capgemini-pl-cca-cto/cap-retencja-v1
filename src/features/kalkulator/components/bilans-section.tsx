import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import BilansForm from './bilans-form';

export const BilansSection = () => {
  return (
    <AccordionItem value="bilans-section">
      <AccordionTrigger className="text-2xl justify-normal items-center gap-4 border-2 border-primary-blue text-primary-blue">
        2. Dane do bilansu objętości wody opadowej
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-4 text-balance items-center">
        {<BilansForm />}
      </AccordionContent>
    </AccordionItem>
  );
};
