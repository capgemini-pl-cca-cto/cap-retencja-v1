import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import BilansForm from './bilans-form';

interface BilansSectionProps {
  disabled: boolean;
  onFormSubmit: () => void;
  isBilansSubmitted: boolean;
}

export const BilansSection = ({
  disabled,
  onFormSubmit,
  isBilansSubmitted,
}: BilansSectionProps) => {
  return (
    <AccordionItem value="bilans-section" disabled={disabled}>
      <AccordionTrigger
        className={`text-2xl justify-normal items-center gap-4 border-2 border-primary-blue text-primary-blue ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        2. Dane do bilansu objętości wody opadowej
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-4 text-balance items-center">
        {!disabled && (
          <BilansForm
            onFormSubmit={onFormSubmit}
            isBilansSubmitted={isBilansSubmitted}
          />
        )}
      </AccordionContent>
    </AccordionItem>
  );
};
