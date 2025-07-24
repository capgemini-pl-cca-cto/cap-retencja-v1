import * as React from 'react';
import { Input } from '../ui/input';
import type { LucideIcon } from 'lucide-react';

export type InputIconProps = {
  icon?: LucideIcon;
  onIconClick?: () => void;
} & React.ComponentProps<typeof Input>;

export const InputIcon = ({ ...inputProps }: InputIconProps) => {
  return (
    <div className="relative">
      <Input {...inputProps} />
      {inputProps.icon && (
        <inputProps.icon
          className="absolute right-0 inset-y-0 my-auto mx-4 hover:cursor-pointer"
          onClick={inputProps.onIconClick}
        />
      )}
    </div>
  );
};
