'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { FormInput } from '@/components/form-input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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
import { InfoBox } from '@/components/info-box';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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
          name="nazwaInwestycji"
          render={() => <FormInput label="Nazwa inwestycji" field={{}} />}
        />
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
        <Collapsible className="flex full flex-col">
          <div className="flex items-center justify-start gap-2">
            <CollapsibleTrigger asChild>
              <Button variant="tertiary" size="icon" className="size-8">
                <ChevronRightIcon className="text-primary-blue pointer-events-none size-4 translate-y-0.5 transition-transform duration-200" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
            <h4 className="text-base font-normal">
              Co składa się na <strong>identyfikator działki</strong>?
            </h4>
          </div>
          <CollapsibleContent className="">
            <div className="px-10 py-4">
              <p>
                Format identyfikatora działki to: "
                <strong>WWWPPGG_R.OOOO.AR_NR.NDZ</strong>":
                <ul className="px-4 py-2 list-disc">
                  <li>
                    WWPPGG_R - (WW - województwo, PP - powiat, GG - gmina, R -
                    typ gminy),
                  </li>
                  <li>OOOO - oznaczenie obrębu ewidencyjnego,</li>
                  <li>
                    AR_NR - oznaczenie arkusza mapy, o ile występuje (NR numer
                    arkusza)
                  </li>
                  <li>NDZ - numer działki</li>
                </ul>
                Identyfikator w takim formacie można znaleźć na platformie&nbsp;
                <a className="font-bold underline" href="geoportalKrajowy">
                  Geoportal Krajowy
                </a>
                .
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
        <FormField
          control={form.control}
          name="typZabudowy"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Typ planowanej zabudowy:</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={'jedno'}
                  className="flex flex-col"
                >
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <RadioGroupItem value="jedno" />
                    </FormControl>
                    <FormLabel className="font-normal">jednorodzinna</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <RadioGroupItem value="wielo" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      wielorodzinna / usługowa / przemysłowa
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <InfoBox description="W przypadku zabudowy jednorodzinnej nie ma możliwości podłączenia się do kanalizacji deszczowej."></InfoBox>
        <div className="p-2 flex">
          <div className="w-1/2"></div>
          <div className="w-1/2 grid grid-cols-2 gap-3 justify-end">
            <Button variant="secondary" className="float-right">
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
