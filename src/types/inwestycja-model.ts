import type { InwestycjaFormSchema } from '@/features/inwestycja/schemas';
import type z from 'zod';

export type DzialkaModel = {
  id: string;
  voivodeship: string;
  county: string;
  commune: string;
  region: string;
  parcel: string;
  coordinates: {
    lat: number;
    lng: number;
  };
};

export type InwestycjaModel = z.infer<typeof InwestycjaFormSchema>;
