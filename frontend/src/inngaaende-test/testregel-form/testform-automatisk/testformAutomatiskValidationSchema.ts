import { z } from 'zod';


export const testformAutomatiskValidationSchema = z.object({
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
  kommentar: z.string().optional(),
  elementUtfall: z.string().min(1),
  elementResultat: z.string().min(1),
  elementOmtale: z.string().min(1),
  elementOmtaleHtml: z.string().optional()
});

export type TestformAutomatiskFormValues = z.infer<
  typeof testformAutomatiskValidationSchema
>;

