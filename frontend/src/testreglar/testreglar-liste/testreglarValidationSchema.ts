import { z } from 'zod';

export const testregelBaseSchema = z.object({
  id: z.coerce.number().optional(),
  namn: z.string().min(1, 'Namn kan ikkje vera tomt'),
  kravId: z.coerce
    .number()
    .refine((data) => !Number.isNaN(Number(data)), 'Krav må veljast'),
  modus: z.union([
    z.literal('automatisk'),
    z.literal('manuell'),
    z.literal('semi-automatisk'),
    z.literal('deque'),
    z.literal('manuell-forenkla'),
  ]),
  default:z.boolean(),
});


export const utfallSchema = z.object({
  beskrivelse: z.string().min(1, 'Beskrivelse kan ikkje vera tomt'),
  testresultat: z.union([
    z.literal('samsvar'),
    z.literal('brot'),
    z.literal('ikkje-testbar'),
    z.literal('ikkje-forekomst'),
  ]),
  default:z.boolean(),
});
z.object({
    description: z.string().optional(),
    utfall: z.array(utfallSchema).optional(),
});
export const testregelSchema = testregelBaseSchema.and(
  z.object({
    testregelSchema: z.string().optional(),
    testregelId: z.string().min(1, 'Testregel-id kan ikkje vera tom'),
    versjon: z.coerce.number().refine((data) => !Number.isNaN(Number(data)), {
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
    tema: z.coerce.number().optional(),
    testobjekt: z.coerce.number().optional().optional(),
    innhaldstypeTesting: z.coerce.number().optional().optional(),
    kravTilSamsvar: z.string().optional(),
    definition: z
      .object({
        description: z.string(),
        utfall: z.array(utfallSchema),
      })
      .optional(),
  })
);

export const testreglarValidationSchema = testregelSchema
  .refine(
    (data) => {
      if (data.modus === 'manuell-forenkla') {
        return (data.definition?.description ?? '').trim().length > 0;
      }
      return true;
    },
    {
      message: 'Instruksjon kan ikkje vera tom',
      path: ['definition', 'description'],
    }
  )
  .refine(
    (data) => {
      if (data.modus !== 'manuell-forenkla') {
        return (data.testregelSchema ?? '').trim().length > 0;
      }
      return true;
    },
    {
      message: 'Testregel kan ikkje vera tom',
      path: ['testregelSchema'],
    }
  )
  .refine(
    (data) => {
      if (data.modus === 'automatisk') {
        return /^(QW-ACT-R)\d{1,2}$/i.test(<string>data.testregelSchema);
      }
      return true;
    },
    { message: 'Format på testregel er QW-ACT-RXX', path: ['testregelSchema'] }
  )
  .refine(
    (data) => {
      if (data.modus === 'manuell') {
        try {
          JSON.parse(<string>data.testregelSchema);
          return true;
        } catch (error) {
          if (error instanceof SyntaxError) {
            return false;
          }
          throw error;
        }
      }

      return true;
    },
    { message: 'Ugyldig JSON-format', path: ['testregelSchema'] }
  );
