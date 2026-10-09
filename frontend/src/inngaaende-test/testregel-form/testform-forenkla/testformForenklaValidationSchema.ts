import { z } from 'zod';

export const customUtfallValue = 'custom' as const;

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
  valgtUtfallIndex: z.union([
    z.literal(customUtfallValue),
    z.coerce.number().int().min(0),
  ]),
  elementOmtale: z.string().min(1),
  elementOmtaleHtml: z.string().optional(),
  customUtfallTestresultat: z.string().optional(),
  customUtfallBeskrivelse: z.string().optional(),
}).superRefine((values, ctx) => {
  if (values.valgtUtfallIndex !== customUtfallValue) {
    return;
  }

  if (!values.customUtfallTestresultat?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Vel resultat for eigendefinert utfall',
      path: ['customUtfallTestresultat'],
    });
  }

  if (!values.customUtfallBeskrivelse?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Skriv inn eigendefinert utfall',
      path: ['customUtfallBeskrivelse'],
    });
  }
});

export type TestformForenklaFormValues = z.infer<
  typeof testformForenklaValidationSchema
>;

