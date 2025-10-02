import type { KalkulatorFormSchema } from '@/features/kalkulator/schemas';
import type z from 'zod';

export type KalkulatorModel = z.infer<typeof KalkulatorFormSchema>;
