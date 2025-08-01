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
import { ChevronRightIcon, LucideMapPinned } from 'lucide-react';
import { Collapsible } from '@radix-ui/react-collapsible';
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertTitle } from '@/components/ui/alert';

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
        <FormInput label="Nazwa inwestycji" field={{}} />
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

        <Collapsible className="flex w-2/3 flex-col">
          <div className="flex items-center justify-start gap-4">
            <CollapsibleTrigger asChild>
              <Button variant="quaternary" size="icon" className="size-8">
                <ChevronRightIcon className="text-primary-blue pointer-events-none size-4 translate-y-0.5 transition-transform duration-200" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
            <h4 className="text-base font-normal">
              Co składa się na <strong>identyfikator działki</strong>?
            </h4>
          </div>
          <CollapsibleContent className="flex gap-2">
            <div className="pl-12">
              Tutaj należy wyjaśnić części składowe identyfikatora działki.
            </div>
          </CollapsibleContent>
        </Collapsible>
        <label>Typ planowanej zabudowy:</label>
        <RadioGroup>
          <div className="flex items-center space-x-2 pt-4 text-base font-normal">
            <RadioGroupItem value="option-one" id="option-one" />
            <Label htmlFor="option-one">jednorodzinna</Label>
          </div>
          <div className="flex items-center space-x-2 text-base font-normal">
            <RadioGroupItem value="option-two" id="option-two" />
            <Label htmlFor="option-two">
              wielorodzinna / usługowa / przemysłowa
            </Label>
          </div>
        </RadioGroup>

        <div className="p-2 flex">
          <div className="w-1/2"></div>
          <div className="w-1/2 flex justify-end">
            <Button
              className="float-right border-black bg-white text-primary-blue shadow-xs hover:bg-gray-200/90"
              type="submit"
            >
              Wyczyść dane
            </Button>
            <Button className="float-right" type="submit">
              Zatwierdź
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
