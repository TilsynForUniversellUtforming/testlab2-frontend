import { parseNumberInput } from '@common/util/stringutils';
import { isDefined } from '@common/util/validationUtils';
import { z } from 'zod';

const saktypeSchema = z.union([
  z.literal('Retest'),
  z.literal('Inngående kontroll'),
  z.literal('Forenklet kontroll'),
  z.literal('Tilsyn'),
]);

const loeysingSourceSchema = z.union([
  z.literal('utval'),
  z.literal('manuell'),
]);

const sakLoeysingSchema = z.object({
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

const verksemdLoeysingRelationSchema = z.object({
  verksemd: sakLoeysingSchema,
  loeysingList: z.array(sakLoeysingSchema).optional(),
});

const inngaaendeVerksemdScheama = verksemdLoeysingRelationSchema
  .optional()
  .refine((value) => isDefined(value?.verksemd), {
    message: 'Verksemd må veljast',
  });

const loeysingVerksemdSchema = z.object({
  loeysing: sakLoeysingSchema,
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

export const sakBaseSchema = z.object({
  navn: z.string().optional(),
  advisorId: z.string().optional(),
  sakNumber: z.string().optional(),
  maxLenker: z.union([z.number(), z.string()]).optional(),
  talLenker: z.union([z.number(), z.string()]).optional(),
  loeysingSource: loeysingSourceSchema,
  loeysingList: z.array(loeysingVerksemdSchema).optional(),
  utval: utvalSchema.optional(),
  testregelList: z.array(testregelSchema).optional(),
  verksemd: inngaaendeVerksemdScheama.optional(),
});

export const sakInitBaseSchema = z.object({
  loeysingSource: loeysingSourceSchema,
  loeysingList: z.array(loeysingVerksemdSchema).optional(),
  utval: utvalSchema.optional(),
  testregelList: z.array(testregelSchema).optional(),
});

export const sakInitValidationSchema = z
  .discriminatedUnion('sakType', [
    z.object({
      sakType: z
        .literal(undefined)
        .refine(
          (value) => value !== undefined && value !== '',
          'Type sak må vejast'
        ),
    }),

    z.object({
      sakType: z.literal('Forenklet kontroll'),
      navn: z.string().trim().nonempty('Tittel kan ikkje vera tom'),
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
    }),

    z.object({
      sakType: z.literal('Inngående kontroll'),
      verksemd: inngaaendeVerksemdScheama,
    }),

    z.object({
      sakType: z.literal('Tilsyn'),
      verksemd: inngaaendeVerksemdScheama,
    }),

    z.object({
      sakType: z.literal('Retest'),
      verksemd: inngaaendeVerksemdScheama,
    }),
  ])
  .and(sakInitBaseSchema)
  .refine(
    (data) => {
      if (data.sakType === 'Forenklet kontroll') {
        return (
          parseNumberInput(data.maxLenker) >= parseNumberInput(data.talLenker)
        );
      } else {
        return true;
      }
    },
    {
      message:
        'Brutto-utval av nettsider må vera større eller likt netto-utval',
      path: ['talLenker'],
    }
  );

export const sakLoeysingValidationSchemaV2 = z
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
    verksemd: verksemdLoeysingRelationSchema,
  })
  .refine(
    (data) => {
      if (data.sakType === 'Forenklet kontroll') {
        if (data.loeysingSource === 'utval' && !data.utval) {
          return false;
        }

        return !(
          data.loeysingSource === 'manuell' &&
          (!data.loeysingList || data.loeysingList.length === 0)
        );
      } else {
        const loeysingList = data.verksemd?.loeysingList || [];
        return (
          loeysingList.length > 0 &&
          loeysingList.filter((l) => l.id === 0).length === 0
        );
      }
    },
    (data) => {
      if (data.sakType === 'Forenklet kontroll') {
        if (data.loeysingSource === 'utval') {
          return { message: 'Utval må veljast', path: ['utval'] };
        }
        return {
          message: 'Minst ei løysing må veljast',
          path: ['loeysingList'],
        };
      }

      const loeysingList = data.verksemd?.loeysingList || [];
      if (loeysingList.length <= 0) {
        return {
          message: 'Ein vermeksemd må ha minst ei løysing for testing',
          path: ['verksemd'],
        };
      } else if (loeysingList.find((l) => l.id === 0)) {
        return {
          message: 'Nokre felt manglar løysing',
          path: ['verksemd.loeysingList'],
        };
      }

      return {
        message: 'Noko gjekk gale',
        path: ['verksemd'],
      };
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
        return { message: 'Utval må veljast', path: ['utval'] };
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
