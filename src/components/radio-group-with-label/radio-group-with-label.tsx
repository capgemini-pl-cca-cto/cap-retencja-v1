import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';

export type RadioGroupWithLabelProps = {
  label: string;
  optionOne: string;
  optionTwo: string;
};

export const RadioGroupWithLabel = ({
  label,
  optionOne,
  optionTwo,
}: RadioGroupWithLabelProps) => {
  return (
    <div>
      <Label>{label}</Label>
      <RadioGroup>
        <div className="flex items-center space-x-2 pt-4 text-base font-normal">
          <RadioGroupItem value="option-one" id="option-one" />
          <Label htmlFor="option-one">{optionOne}</Label>
        </div>
        <div className="flex items-center space-x-2 text-base font-normal">
          <RadioGroupItem value="option-two" id="option-two" />
          <Label htmlFor="option-two">{optionTwo}</Label>
        </div>
      </RadioGroup>
    </div>
  );
};
