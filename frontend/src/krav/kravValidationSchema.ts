import { z } from 'zod';

import { KravStatus, WcagPrinsipp, WcagRetninglinje } from './types';

export const kravValidationSchema = z.object({
  tittel: z.string().min(1, 'Tittel kan ikkje vera tomt'),
  suksesskriterium: z
    .string()
    .min(1, 'Suksesskriterium kan ikkje vera tomt')
    .regex(
      /(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/
    ),
  gjeldNettsider: z.boolean(),
  gjeldApp: z.boolean(),
  gjeldAutomat: z.boolean(),
  prinsipp: z.nativeEnum(WcagPrinsipp),
  retningslinje: z.nativeEnum(WcagRetninglinje),
  samsvarsnivaa: z.union([z.literal('A'), z.literal('AA'), z.literal('AAA')]),
  status: z.nativeEnum(KravStatus),
  urlRettleiing: z
    .string()
    .min(1, 'URL til rettleiing kan ikkje vera tomt')
    .url('URL må vera ein gyldig URL'),
  innhald: z.string().min(1, 'Innhald kan ikkje vera tomt'),
  kommentarBrudd: z.string().optional(),
});
