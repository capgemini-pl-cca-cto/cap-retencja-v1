import { z } from 'zod';

export const BilansFormSchema = z.object({
  powDzialki: z.number(),
  powDachow: z.number(),
  powDachowPozaObrysem: z.number(),
  powUszczelnione: z.number(),
  powPrzepuszczalne: z.number(),
  powTerenyInne: z.number(),
});

export type BilansModel = z.infer<typeof BilansFormSchema>;
