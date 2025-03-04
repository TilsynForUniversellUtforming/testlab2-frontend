import { z } from 'zod';

export const kravValidationSchema = z.object({
  tittel: z.string().min(1, 'Tittel kan ikkje vera tomt'),
  suksesskriterium: z
    .string()
    .min(1, 'Suksesskriterium kan ikkje vera tomt')
    .regex(
      new RegExp(
        '(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$'
      )
    ),
  gjeldNettsider: z.boolean().optional(),
  gjeldApp: z.boolean().optional(),
  gjeldAutomat: z.boolean().optional(),
  prinsipp: z.string().min(1, 'Prinsipp kan ikkje vera tomt'),
  retningslinje: z.string().min(1, 'Retningslinje kan ikkje vera tomt'),
  samsvarsnivaa: z.union([z.literal('A'), z.literal('AA'), z.literal('AAA')]),
  status: z.union([
    z.literal('nytt'),
    z.literal('gjeldande'),
    z.literal('utgaatt'),
  ]),
  urlRettleiing: z
    .string()
    .min(1, 'URL til rettleiing kan ikkje vera tomt')
    .url('URL må vera ein gyldig URL'),
  innhald: z.string().min(1, 'Innhald kan ikkje vera tomt'),
  kommentarBrudd: z.string().optional(),
});
