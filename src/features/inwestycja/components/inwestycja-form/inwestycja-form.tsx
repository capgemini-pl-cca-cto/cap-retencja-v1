'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { FormInput } from '@/components/form-input';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import {
  InwestycjaFormSchema,
  type InwestycjaModel,
} from '../../types/inwestycja-schema';
import { LucideMapPinned } from 'lucide-react';

export type InwestycjaFormProps = {
  onSubmit: (data: InwestycjaModel) => void;
};

export function InwestycjaForm({ onSubmit }: InwestycjaFormProps) {
  const form = useForm<z.infer<typeof InwestycjaFormSchema>>({
    resolver: zodResolver(InwestycjaFormSchema),
    defaultValues: {
      identyfikatorInwestycji: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="identyfikatorInwestycji"
          render={({ field }) => (
            <FormInput
              label="Identyfikator działki inwestycyjnej"
              description="Wpisz identyfikator w formacie WWPPGG_R.OOOO.AR_NR.DZ lub wskaż miejsce na mapie"
              field={{
                ...field,
                icon: LucideMapPinned,
                onIconClick: () => alert('Test icon clicked!'),
              }}
            />
          )}
        />
        <Button type="submit">Zatwierdź</Button>
      </form>
    </Form>
  );
}
