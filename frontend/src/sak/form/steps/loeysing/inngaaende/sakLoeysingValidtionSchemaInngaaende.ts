import { z } from 'zod';

import { loeysingSchema } from '../../init/inngaaendeVerksemdSchema';

const nettsidePropertiesSchema = z.object({
  url: z.string({ required_error: 'Manglar url' }).min(1, 'Manglar url'),
  description: z
    .string({ required_error: 'Manglar beskrivelse' })
    .min(1, 'Manglar beskrivelse'),
});

const loeysingNettsideRelationScehma = z.object({
  loeysing: loeysingSchema,
  forside: nettsidePropertiesSchema,
  navigasjonsmeny: nettsidePropertiesSchema,
  bilder: nettsidePropertiesSchema,
  overskrifter: nettsidePropertiesSchema,
  artikkel: nettsidePropertiesSchema,
  skjema: nettsidePropertiesSchema,
  tabell: nettsidePropertiesSchema,
  knapper: nettsidePropertiesSchema,
});

const verksemdLoeysingRelationSchema = z.object({
  verksemd: z.any(),
  manualVerksemd: z.any(),
  loeysingList: z.array(loeysingNettsideRelationScehma),
});

export const sakLoeysingValidationSchemaInngaaende = z.object({
  verksemdLoeysingRelation: verksemdLoeysingRelationSchema,
});
