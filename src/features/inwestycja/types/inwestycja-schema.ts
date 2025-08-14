import { z } from 'zod';

export const InwestycjaFormSchema = z.object({
  identyfikatorInwestycji: z.string().min(22, {
    message: 'Wpisz identyfikator działki lub wybierz działkę z mapy!',
  }),
  typZabudowy: z.enum(['jedno', 'wielo'], {
    message: 'Proszę wybrać typ zabudowy',
  }),
  nazwaInwestycji: z.string({
    message: 'Proszę wpisać nazwę inwestycji',
  }),
});

export type InwestycjaModel = z.infer<typeof InwestycjaFormSchema>;
