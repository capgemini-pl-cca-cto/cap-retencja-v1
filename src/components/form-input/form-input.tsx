import { InputIcon, type InputIconProps } from '../input-icon';
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';

export type FormInputProps = {
  label: string;
  description?: string;
  field: InputIconProps;
};

export const FormInput = ({ label, description, field }: FormInputProps) => {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <InputIcon {...field} />
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
};
