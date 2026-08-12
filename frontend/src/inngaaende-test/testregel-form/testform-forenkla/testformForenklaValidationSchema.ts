import { z } from 'zod';

const svarSchema = z.object({
  steg: z.string().min(1),
  svar: z.string(),
});

export const testformForenklaValidationSchema = z.object({
  id: z.number(),
  testgrunnlagId: z.number(),
  loeysingId: z.number(),
  testregelId: z.number(),
  sideutvalId: z.number(),
  status: z.union([
    z.literal('Ferdig'),
    z.literal('Deaktivert'),
    z.literal('UnderArbeid'),
    z.literal('IkkjePaabegynt'),
  ]),
  sistLagra: z.string().min(1),
  svar: z.array(svarSchema).optional(),
  kommentar: z.string().optional(),
  valgtUtfallIndex: z.coerce.number().int().min(0),
});

export type TestformForenklaFormValues = z.infer<
  typeof testformForenklaValidationSchema
>;

