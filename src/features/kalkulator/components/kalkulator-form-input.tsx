import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Control } from 'react-hook-form';
import { useState } from 'react';
import type { KalkulatorModel } from '@/types/kalkulator-model';

interface KalkulatorInputProps {
  control: Control<KalkulatorModel>;
  name: keyof KalkulatorModel;
  label: string;
  subLabel?: string;
  hasGlobalError: boolean;
  isKalkulatorSubmitted: boolean;
}

export default function KalkulatorInput({
  control,
  name,
  label,
  subLabel,
  hasGlobalError,
  isKalkulatorSubmitted,
}: KalkulatorInputProps) {
  const [displayValue, setDisplayValue] = useState<string>('0,00');

  const formatNumber = (value: number): string => {
    if (value === 0) return '0,00';
    return value.toString().replace('.', ',');
  };

  const parseNumber = (value: string): number => {
    const cleanValue = value.replace(',', '.');
    const num = parseFloat(cleanValue);
    return isNaN(num) ? 0 : Math.max(0, num); // Ensure no negative numbers
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: number) => void,
  ) => {
    const inputValue = e.target.value;

    // Allow only numbers, comma, and one decimal separator
    const regex = /^[0-9]*,?[0-9]*$/;

    if (regex.test(inputValue) || inputValue === '') {
      setDisplayValue(inputValue);

      if (inputValue === '' || inputValue === '0' || inputValue === '0,') {
        onChange(0);
      } else {
        const numericValue = parseNumber(inputValue);
        onChange(numericValue);
      }
    }
  };

  const handleBlur = (field: {
    onChange: (value: number) => void;
    value: number;
  }) => {
    // Format the display value on blur
    if (displayValue === '' || displayValue === '0' || displayValue === '0,') {
      setDisplayValue('0,00');
      field.onChange(0);
    } else {
      const numericValue = parseNumber(displayValue);
      setDisplayValue(formatNumber(numericValue));
      field.onChange(numericValue);
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        // Initialize display value when field value changes externally (e.g., form reset)
        if (field.value === 0 && displayValue !== '0,00') {
          setDisplayValue('0,00');
        } else if (field.value !== 0 && displayValue === '0,00') {
          setDisplayValue(formatNumber(field.value));
        }

        return (
          <FormItem className="flex justify-between gap-13">
            <FormLabel
              className={`data-[error=true]:text-current ${subLabel && 'flex flex-col items-start gap-1'}`}
            >
              {label}
              {subLabel && <span className="font-light">{subLabel}</span>}
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  className="w-[285px] text-right"
                  value={displayValue}
                  onChange={(e) => handleInputChange(e, field.onChange)}
                  onBlur={() => handleBlur(field)}
                  placeholder="0,00"
                  aria-invalid={!!fieldState.error || hasGlobalError}
                  disabled={isKalkulatorSubmitted === true}
                />
              </div>
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
}
