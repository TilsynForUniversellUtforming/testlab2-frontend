import { parseNumberInput } from '@common/util/stringutils';
import { z } from 'zod';

const saktypeSchema = z.union([
  z.literal('Dispensasjonssøknad'),
  z.literal('IKT-fagleg uttale'),
  z.literal('Forenklet kontroll'),
  z.literal('Statusmåling'),
  z.literal('Tilsyn'),
  z.literal('Anna'),
]);

const loeysingSourceSchema = z.union([
  z.literal('utval'),
  z.literal('manuell'),
]);

const loeysingSchema = z.object({
  id: z.number(),
  namn: z.string(),
  url: z.string(),
  orgnummer: z.string(),
});

const verksemdSchema = z.object({
  id: z.number(),
  namn: z.string(),
  organisasjonsnummer: z.string(),
});

const loeysingVerksemdSchema = z.object({
  loeysing: loeysingSchema,
  verksemd: verksemdSchema,
});

const utvalSchema = z.object({
  id: z.number(),
  namn: z.string(),
});

const testregelSchema = z.object({
  id: z.number(),
  krav: z.string(),
  testregelNoekkel: z.string(),
  kravTilSamsvar: z.string(),
});

export const sakInitVerksemdValidationSchema = z.object({
  navn: z.string().optional(),
  sakType: saktypeSchema.optional(),
  advisorId: z.string().optional(),
  sakNumber: z.string().optional(),
  maxLenker: z.union([z.number(), z.string()]).optional(),
  talLenker: z.union([z.number(), z.string()]).optional(),
  loeysingSource: loeysingSourceSchema,
  loeysingList: z.array(loeysingVerksemdSchema).optional(),
  utval: utvalSchema.optional(),
  testregelList: z.array(testregelSchema).optional(),
  verksemd: loeysingSchema,
});

export const sakInitValidationSchema = z
  .object({
    navn: z.string().trim().nonempty('Tittel kan ikkje vera tom'),
    sakType: saktypeSchema
      .optional()
      .refine((value) => value !== undefined, 'Type sak må vejast'),
    advisorId: z
      .string()
      .optional()
      .refine(
        (value) => value !== undefined && value !== '',
        'Sakshandsamar kan ikkje vera tom'
      ),
    sakNumber: z.string().optional(),
    maxLenker: z
      .union([z.number(), z.string()])
      .transform((val) => parseNumberInput(val))
      .refine((value) => value >= 1 && value <= 10000, {
        message: 'Brutto-utval av nettsider må være mellom 1 og 10 000',
      }),
    talLenker: z
      .union([z.number(), z.string()])
      .transform((val) => parseNumberInput(val))
      .refine((value) => value >= 1 && value <= 2000, {
        message: 'Netto-utval av nettsider må være mellom 1 og 2000',
      }),
    loeysingSource: loeysingSourceSchema,
    loeysingList: z.array(loeysingVerksemdSchema).optional(),
    utval: utvalSchema.optional(),
    testregelList: z.array(testregelSchema).optional(),
  })
  .refine(
    (data) =>
      parseNumberInput(data.maxLenker) >= parseNumberInput(data.talLenker),
    {
      message:
        'Brutto-utval av nettsider må vera større eller likt netto-utval',
      path: ['talLenker'],
    }
  );

export const sakLoeysingValidationSchema = z
  .object({
    navn: z.string().optional(),
    sakType: saktypeSchema.optional(),
    advisorId: z.string().optional(),
    sakNumber: z.string().optional(),
    maxLenker: z.union([z.number(), z.string()]).optional(),
    talLenker: z.union([z.number(), z.string()]).optional(),
    loeysingSource: loeysingSourceSchema,
    loeysingList: z.array(loeysingVerksemdSchema).optional(),
    utval: utvalSchema.optional(),
    testregelList: z.array(testregelSchema).optional(),
  })
  .refine(
    (data) => {
      if (data.loeysingSource === 'utval' && !data.utval) {
        return false;
      }
      return !(
        data.loeysingSource === 'manuell' &&
        (!data.loeysingList || data.loeysingList.length === 0)
      );
    },
    (data) => {
      if (data.loeysingSource === 'utval') {
        return { message: 'Utval må veljast', path: ['loeysingList'] };
      }
      return { message: 'Minst ei løysing må veljast', path: ['loeysingList'] };
    }
  );

export const sakTestreglarValidationSchema = z.object({
  navn: z.string().optional(),
  sakType: saktypeSchema.optional(),
  advisorId: z.string().optional(),
  sakNumber: z.string().optional(),
  maxLenker: z.union([z.number(), z.string()]).optional(),
  talLenker: z.union([z.number(), z.string()]).optional(),
  loeysingSource: loeysingSourceSchema,
  loeysingList: z.array(loeysingVerksemdSchema).optional(),
  utval: utvalSchema.optional(),
  testregelList: z.array(testregelSchema).min(1, 'Testreglar må veljast'),
});
