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
import { useState } from 'react';
import type { Control } from 'react-hook-form';
import MapModal from './map-modal';
import type { InwestycjaModel } from '@/types/inwestycja-model';

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
                    <svg
                      className="absolute right-0 inset-y-0 my-auto mx-4 hover:cursor-pointer w-[15px] h-5"
                      viewBox="0 0 15 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.5 17C5.15 15.2667 3.39583 13.5833 2.2375 11.95C1.07917 10.3167 0.5 8.71667 0.5 7.15C0.5 5.06667 1.15 3.35417 2.45 2.0125C3.75 0.670833 5.43333 0 7.5 0C9.56667 0 11.25 0.670833 12.55 2.0125C13.85 3.35417 14.5 5.06667 14.5 7.15C14.5 8.71667 13.9208 10.3167 12.7625 11.95C11.6042 13.5833 9.85 15.2667 7.5 17ZM7.5 9C8.05 9 8.52083 8.80417 8.9125 8.4125C9.30417 8.02083 9.5 7.55 9.5 7C9.5 6.45 9.30417 5.97917 8.9125 5.5875C8.52083 5.19583 8.05 5 7.5 5C6.95 5 6.47917 5.19583 6.0875 5.5875C5.69583 5.97917 5.5 6.45 5.5 7C5.5 7.55 5.69583 8.02083 6.0875 8.4125C6.47917 8.80417 6.95 9 7.5 9ZM0.5 20V18H14.5V20H0.5Z"
                        fill="#0C4F7B"
                      />
                    </svg>
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
