import { z } from 'zod';

export const KalkulatorFormSchema = z
  .object({
    powDzialki: z.number().min(0, 'Wartość nie może być mniejsza niż 0'),
    powDachow: z.number().min(0, 'Wartość nie może być mniejsza niż 0'),
    powDachowPozaObrysem: z
      .number()
      .min(0, 'Wartość nie może być mniejsza niż 0'),
    powUszczelnione: z.number().min(0, 'Wartość nie może być mniejsza niż 0'),
    powPrzepuszczalne: z.number().min(0, 'Wartość nie może być mniejsza niż 0'),
    powTerenyInne: z.number().min(0, 'Wartość nie może być mniejsza niż 0'),
  })
  .refine(
    (data) => {
      const sum =
        data.powDachow +
        data.powDachowPozaObrysem +
        data.powUszczelnione +
        data.powPrzepuszczalne +
        data.powTerenyInne;
      return Math.abs(data.powDzialki - sum) < 0.01; // allow small floating point error
    },
    {
      //using empty path for global validation error, not associated with any specific field
      message:
        'Suma powierzchni podanych w polach P1, P2, P3, P4 i P5 nie jest równa powierzchni działki inwestycyjnej podanej w polu P0. Sprawdź poprawność danych!',
      path: [],
    },
  );
