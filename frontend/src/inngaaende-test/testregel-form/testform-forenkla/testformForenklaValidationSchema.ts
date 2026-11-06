import { z } from 'zod';

export const customUtfallValue = 'custom' as const;

const svarSchema = z.object({
  steg: z.string().min(1),
  svar: z.string(),
});

const selectedUtfallIndexSchema = z.preprocess(
  (value) => {
    if (value === null || value === undefined || value === '') {
      return undefined;
    }

    if (typeof value === 'string') {
      if (value === customUtfallValue) {
        return value;
      }

      const trimmed = value.trim();
      if (/^\d+$/.test(trimmed)) {
        return Number(trimmed);
      }
    }

    return value;
  },
  z.union([z.literal(customUtfallValue), z.number().int().min(0)])
);

export const testformForenklaValidationSchema = z
  .object({
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
    valgtUtfallIndex: selectedUtfallIndexSchema,
    elementOmtale: z.string().min(1),
    elementOmtaleHtml: z.string().optional(),
    elementPlassering: z.string().optional(),
    ekstraSjekk: z.boolean().optional(),
    customUtfallTestresultat: z.string().optional(),
    customUtfallBeskrivelse: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.valgtUtfallIndex !== customUtfallValue) {
      return;
    }

    if (!values.customUtfallTestresultat?.trim()) {
      ctx.addIssue({
        code: 'custom',
        message: 'Vel resultat for eigendefinert utfall',
        path: ['customUtfallTestresultat'],
      });
    }

    if (!values.customUtfallBeskrivelse?.trim()) {
      ctx.addIssue({
        code: 'custom',
        message: 'Skriv inn eigendefinert utfall',
        path: ['customUtfallBeskrivelse'],
      });
    }
  });

export type TestformForenklaFormValues = z.infer<
  typeof testformForenklaValidationSchema
>;
