import { z } from 'zod';

export const InwestycjaFormSchema = z.object({
  nazwaInwestycji: z.string().nonempty('Wpisz nazwę inwestycji!'),
  identyfikatorInwestycji: z
    .string()
    .min(22, 'Wpisz identyfikator działki lub wybierz działkę z mapy!'),
  typZabudowy: z.enum(['jednorodzinna', 'wielorodzinna']),
  isPodłączony: z.enum(['tak', 'nie']),
});
