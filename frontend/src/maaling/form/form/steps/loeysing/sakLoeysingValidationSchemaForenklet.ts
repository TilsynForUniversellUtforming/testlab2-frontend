import { sakInitValidationSchema } from '@maaling/form/form/steps/init/sakFormValidationSchema';
import { z } from 'zod';

import { loeysingSchema } from '../init/inngaaendeVerksemdSchema';

export const loeysingSourceSchema = z.union([
  z.literal('utval'),
  z.literal('manuell'),
]);

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

export const sakLoeysingValidationSchemaForenklet = z
  .object({
    loeysingSource: loeysingSourceSchema,
    loeysingList: z.array(loeysingVerksemdSchema).optional(),
    utval: utvalSchema.optional(),
  })
  .and(sakInitValidationSchema)
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
