import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import type { Control } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { InwestycjaModel } from '@/types/inwestycja-model';

interface FormRadioProps {
  control: Control<InwestycjaModel>;
  name: keyof InwestycjaModel;
  mainLabel: string;
  values: string[];
  inputLabels: string[];
}

export default function FormRadio({
  control,
  name,
  mainLabel,
  values,
  inputLabels,
}: FormRadioProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-light">{mainLabel}</FormLabel>
          <FormControl>
            <RadioGroup onValueChange={field.onChange} value={field.value}>
              <FormItem className="flex items-center gap-3">
                <FormControl>
                  <RadioGroupItem value={values[0]} />
                </FormControl>
                <FormLabel className="font-light">{inputLabels[0]}</FormLabel>
              </FormItem>
              <FormItem className="flex items-center gap-3">
                <FormControl>
                  <RadioGroupItem value={values[1]} />
                </FormControl>
                <FormLabel className="font-light">{inputLabels[1]}</FormLabel>
              </FormItem>
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
