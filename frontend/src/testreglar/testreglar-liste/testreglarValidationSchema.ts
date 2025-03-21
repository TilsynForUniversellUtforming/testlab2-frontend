import { z } from 'zod';

export const testregelBaseSchema = z.object({
  id: z.number().optional(),
  namn: z.string().min(1, 'Namn kan ikkje vera tomt'),
  kravId: z
    .union([z.number(), z.string()])
    .refine((data) => !isNaN(Number(data)), 'Krav må veljast'),
  modus: z.union([
    z.literal('automatisk'),
    z.literal('manuell'),
    z.literal('semi-automatisk'),
  ]),
});

export const testregelSchema = testregelBaseSchema.and(
  z.object({
    testregelSchema: z.string().min(1, 'Testregel test-id kan ikkje vera tom'),
    testregelId: z.string().min(1, 'Testregel-id kan ikkje vera tom'),
    versjon: z
      .union([z.number(), z.string()])
      .refine((data) => !isNaN(Number(data)), {
        message: 'Format på testregel er QW-ACT-RXX',
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
    tema: z.union([z.number(), z.string()]).optional(),
    testobjekt: z.union([z.number(), z.string()]).optional(),
    innhaldstypeTesting: z.union([z.number(), z.string()]).optional(),
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
