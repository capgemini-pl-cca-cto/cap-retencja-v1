import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import KalkulatorForm from './kalkulator-form';

interface KalkulatorSectionProps {
  disabled: boolean;
  onFormSubmit: () => void;
  isKalkulatorSubmitted: boolean;
}

export const KalkulatorSection = ({
  disabled,
  onFormSubmit,
  isKalkulatorSubmitted,
}: KalkulatorSectionProps) => {
  return (
    <AccordionItem value="kalkulator-section" disabled={disabled}>
      <AccordionTrigger
        className={`text-2xl justify-normal items-center gap-4 border-2 border-primary-blue text-primary-blue ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        2. Dane do bilansu objętości wody opadowej
      </AccordionTrigger>
      <AccordionContent className="flex flex-col text-balance items-center pb-0">
        {!disabled && (
          <KalkulatorForm
            onFormSubmit={onFormSubmit}
            isKalkulatorSubmitted={isKalkulatorSubmitted}
          />
        )}
      </AccordionContent>
    </AccordionItem>
  );
};
