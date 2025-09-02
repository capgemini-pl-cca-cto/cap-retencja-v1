import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Control } from 'react-hook-form';
import type { BilansModel } from '../schemas';

interface BalansInputProps {
  control: Control<BilansModel>;
  name: keyof BilansModel;
  label: string;
  subLabel?: string;
}

export default function BilansInput({
  control,
  name,
  label,
  subLabel,
}: BalansInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex justify-between gap-13">
          <FormLabel
            className={`${subLabel && 'flex flex-col items-start gap-1'}`}
          >
            {label}
            {subLabel && <span className="font-light">{subLabel}</span>}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                {...field}
                className="w-[285px] text-right"
                value={String(field.value) === '0' ? '0,00' : field.value}
              />
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
