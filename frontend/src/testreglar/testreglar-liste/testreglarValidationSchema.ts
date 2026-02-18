import { z } from 'zod';

export const testregelBaseSchema = z.object({
  id: z.coerce.number().optional(),
  namn: z.string().min(1, 'Namn kan ikkje vera tomt'),
  kravId: z.coerce
     .number()
    .refine((data) => !Number.isNaN(Number(data)), 'Krav må veljast').optional(),
  modus: z.union([
    z.literal('automatisk'),
    z.literal('manuell'),
    z.literal('semi-automatisk'),
    z.literal('deque'),
  ]),
});

export const testregelSchema = testregelBaseSchema.and(
  z.object({
    testregelSchema: z.string().min(1, 'Testregel test-id kan ikkje vera tom'),
    testregelId: z.string().min(1, 'Testregel-id kan ikkje vera tom'),
    versjon: z.coerce
      .number()
      .refine((data) => !Number.isNaN(Number(data)), {
        message: 'Versjon må være et gyldig nummer',
      }),
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
    ]),
    type: z.union([
      z.literal('app'),
      z.literal('automat'),
      z.literal('dokument'),
      z.literal('nett'),
    ]),
    spraak: z.union([z.literal('nn'), z.literal('nb'), z.literal('en')]),
    tema:z.coerce.number().optional(),
    testobjekt: z.coerce.number().optional().optional(),
    innhaldstypeTestingId: z.coerce.number().optional().optional(),
    kravTilSamsvar: z.string().optional(),
  })
);

export const testreglarValidationSchema = testregelSchema
  .refine(
    (data) => {
      if (data.modus === 'automatisk') {
        return /^(QW-ACT-R)[0-9]{1,2}$/i.test(data.testregelSchema);
      }
      return true;
    },
    { message: 'Format på testregel er QW-ACT-RXX', path: ['testregelSchema'] }
  )
  .refine(
    (data) => {
      if (data.modus === 'manuell') {
        try {
          JSON.parse(data.testregelSchema);
          return true;
        } catch (e) {
          return false;
        }
      }

      return true;
    },
    { message: 'Ugyldig JSON-format', path: ['testregelSchema'] }
  );
