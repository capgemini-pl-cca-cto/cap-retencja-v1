import { z } from 'zod';

export const InwestycjaFormSchema = z.object({
  nazwaInwestycji: z.string().nonempty('Nazwa inwestycji jest wymagana'),
  identyfikatorInwestycji: z
    .string()
    .min(22, 'Wpisz identyfikator działki lub wybierz działkę z mapy!'),
  typZabudowy: z.string(),
  isPodłączony: z.string(),
});

export type InwestycjaModel = z.infer<typeof InwestycjaFormSchema>;
