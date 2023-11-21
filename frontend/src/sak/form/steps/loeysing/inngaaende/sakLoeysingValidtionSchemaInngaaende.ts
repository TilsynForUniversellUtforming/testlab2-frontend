import { z } from 'zod';

import { loeysingSchema } from '../../init/inngaaendeVerksemdSchema';

const nettsidePropertyType = z.union([
  z.literal('forside'),
  z.literal('navigasjonsmeny'),
  z.literal('bilder'),
  z.literal('overskrifter'),
  z.literal('artikkel'),
  z.literal('skjema'),
  z.literal('tabell'),
  z.literal('knapper'),
  z.literal('egendefinert'),
  z.literal(undefined),
]);

const nettsidePropertiesSchema = z
  .object({
    type: nettsidePropertyType,
    url: z.undefined().or(z.string().min(1)),
    description: z.undefined().or(z.string().min(1)),
    reason: z.undefined().or(z.string().min(1)),
  })
  .superRefine((nettsideProps, ctx) => {
    if (nettsideProps.url || nettsideProps.description || nettsideProps.type) {
      const message = 'Alle felt må vera fylt ut eller tomme';
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: message,
        path: ['url'],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: message,
        path: ['description'],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: message,
        path: ['type'],
      });
    }
  });

const loeysingNettsideRelationScehma = z.object({
  loeysing: loeysingSchema,
  properties: z.array(nettsidePropertiesSchema),
});

const verksemdLoeysingRelationSchema = z.object({
  verksemd: z.any(),
  manualVerksemd: z.any(),
  loeysingList: z.array(loeysingNettsideRelationScehma),
});

export const sakLoeysingValidationSchemaInngaaende = z.object({
  verksemdLoeysingRelation: verksemdLoeysingRelationSchema,
});
