import { parseNumberInput } from '@common/util/stringutils';
import { z } from 'zod';

import { inngaaendeVerksemdSchema } from './inngaaendeVerksemdSchema';

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
      verksemdLoeysingRelation: inngaaendeVerksemdSchema,
    }),

    z.object({
      sakType: z.literal('Tilsyn'),
      verksemdLoeysingRelation: inngaaendeVerksemdSchema,
    }),

    z.object({
      sakType: z.literal('Retest'),
      verksemdLoeysingRelation: inngaaendeVerksemdSchema,
    }),
  ])
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
