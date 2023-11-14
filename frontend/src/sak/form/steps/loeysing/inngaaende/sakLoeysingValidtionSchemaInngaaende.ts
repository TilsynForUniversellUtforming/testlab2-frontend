import { z } from 'zod';

import { loeysingSchema } from '../../init/inngaaendeVerksemdSchema';

const nettsidePropertyType = z.union([
  z.literal('navigasjonsmeny'),
  z.literal('bilder'),
  z.literal('overskrifter'),
  z.literal('artikkel'),
  z.literal('skjema'),
  z.literal('tabell'),
  z.literal('knapper'),
  z.literal('custom'),
]);

const nettsidePropertiesSchema = z.object({
  url: z.string({ required_error: 'Manglar url' }).min(1, 'Manglar url'),
  description: z.union([
    z.undefined(),
    z
      .string({ required_error: 'Manglar beskrivelse' })
      .min(1, 'Manglar beskrivelse'),
  ]),
  type: nettsidePropertyType,
});

const loeysingNettsideRelationScehma = z.object({
  loeysing: loeysingSchema,
  properties: z
    .array(nettsidePropertiesSchema)
    .min(1, 'Må velje mist ein standardside'),
});

const verksemdLoeysingRelationSchema = z.object({
  verksemd: z.any(),
  manualVerksemd: z.any(),
  loeysingList: z.array(loeysingNettsideRelationScehma),
});

export const sakLoeysingValidationSchemaInngaaende = z.object({
  verksemdLoeysingRelation: verksemdLoeysingRelationSchema,
});
