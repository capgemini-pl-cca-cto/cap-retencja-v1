import { z } from 'zod';

export const InwestycjaFormSchema = z.object({
  nazwaInwestycji: z.string().nonempty('Wpisz nazwę inwestycji!'),
  identyfikatorInwestycji: z
    .string()
    .min(21, 'Wpisz identyfikator działki lub wybierz działkę z mapy!'),
  typZabudowy: z.enum(['jednorodzinna', 'wielorodzinna']),
  isPodlaczony: z.enum(['tak', 'nie']),
  isIstniejacePolaczenie: z.enum(['tak', 'nie']),
});
