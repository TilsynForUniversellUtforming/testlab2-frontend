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
  gjeldNettsider: z.boolean(),
  gjeldApp: z.boolean(),
  gjeldAutomat: z.boolean(),
  prinsipp: z.string().min(1, 'Prinsipp kan ikkje vera tomt'),
  retningslinje: z.string().min(1, 'Retningslinje kan ikkje vera tomt'),
  samsvarsnivaa: z.union([z.literal('A'), z.literal('AA'), z.literal('AAA')]),
  status: z.union([
    z.literal('ikkje_starta'),
    z.literal('under_arbeid'),
    z.literal('gjennomgaatt_workshop'),
    z.literal('klar_for_testing'),
    z.literal('treng_avklaring'),
    z.literal('ferdig_testa'),
    z.literal('klar_for_kvalitetssikring'),
    z.literal('publisert'),
    z.literal('utgaar'),
    z.literal('gjeldande'),
  ]),
  urlRettleiing: z
    .string()
    .min(1, 'URL til rettleiing kan ikkje vera tomt')
    .url('URL må vera ein gyldig URL'),
  innhald: z.string().min(1, 'Innhald kan ikkje vera tomt'),
});
