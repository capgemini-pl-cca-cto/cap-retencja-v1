import { z } from 'zod';

export const InwestycjaFormSchema = z.object({
  identyfikatorInwestycji: z.string().min(22, {
    message: 'Wpisz identyfikator działki lub wybierz działkę z mapy!',
  }),
});

export type InwestycjaModel = z.infer<typeof InwestycjaFormSchema>;
