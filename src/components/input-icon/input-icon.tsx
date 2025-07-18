import * as React from 'react';
import { Input } from '../ui/input';
import type { LucideIcon } from 'lucide-react';

export type InputIconProps = {
  icon?: LucideIcon;
  onIconClick?: () => void;
} & React.ComponentProps<typeof Input>;

export const InputIcon = ({ ...inputProps }: InputIconProps) => {
  return (
    <div>
      <Input {...inputProps} />
    </div>
  );
};
