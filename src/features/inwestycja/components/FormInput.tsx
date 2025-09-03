import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Control } from 'react-hook-form';
import { MapPinned } from 'lucide-react';
import type { InwestycjaModel } from '../schemas';

interface FormInputProps {
  control: Control<InwestycjaModel>;
  name: keyof InwestycjaModel;
  label: string;
  isInwestycjaSubmitted: boolean;
  description?: string;
  showMapIcon?: boolean;
}

export default function FormInput({
  control,
  name,
  label,
  isInwestycjaSubmitted,
  description,
  showMapIcon,
}: FormInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel className="data-[error=true]:text-current">
            {label}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                {...field}
                disabled={isInwestycjaSubmitted === true}
                aria-invalid={!!fieldState.error}
              />
              {showMapIcon && isInwestycjaSubmitted === false && (
                <MapPinned
                  className="absolute right-0 inset-y-0 my-auto mx-4 hover:cursor-pointer"
                  onClick={() => alert('Icon Test icon clicked!')}
                />
              )}
            </div>
          </FormControl>
          {description && isInwestycjaSubmitted === false && (
            <FormDescription className="font-light">
              {description}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
