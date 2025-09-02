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
  description?: string;
  showMapIcon?: boolean;
}

export default function FormInput({
  control,
  name,
  label,
  description,
  showMapIcon,
}: FormInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input {...field} />
              {showMapIcon && (
                <MapPinned
                  className="absolute right-0 inset-y-0 my-auto mx-4 hover:cursor-pointer"
                  onClick={() => alert('Icon Test icon clicked!')}
                />
              )}
            </div>
          </FormControl>
          {description && (
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
