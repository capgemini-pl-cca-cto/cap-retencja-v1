import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MapPinned } from 'lucide-react';
import { useState } from 'react';
import type { Control } from 'react-hook-form';
import type { InwestycjaModel } from '../schemas';
import MapModal from './MapModal';

interface FormInputProps {
  control: Control<InwestycjaModel>;
  name: keyof InwestycjaModel;
  label: string;
  isInwestycjaSubmitted: boolean;
  description?: string;
  showMapIcon?: boolean;
  setIdentyfikatorFromMap?: (value: string) => void;
}

export default function FormInput({
  control,
  name,
  label,
  isInwestycjaSubmitted,
  description,
  showMapIcon,
  setIdentyfikatorFromMap,
}: FormInputProps) {
  const [isMapOpen, setIsMapOpen] = useState(false);

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
                <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
                  <DialogTrigger asChild>
                    <MapPinned className="absolute right-0 inset-y-0 my-auto mx-4 hover:cursor-pointer" />
                  </DialogTrigger>
                  <DialogContent
                    showCloseButton={false}
                    className="!fixed !inset-0 !w-screen !h-screen !max-w-none !max-h-none !p-0 !m-0 !border-0 !rounded-none !top-0 !left-0 !translate-x-0 !translate-y-0 !grid-cols-1"
                  >
                    <MapModal
                      setIdentyfikatorFromMap={setIdentyfikatorFromMap!}
                    />
                  </DialogContent>
                </Dialog>
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
