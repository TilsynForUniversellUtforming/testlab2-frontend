import { isDefined } from '@common/util/validationUtils';
import { loeysingSchema } from '@sak/form/steps/init/sakFormValidationSchema';
import { z } from 'zod';

const loeysingNettsideRelationScehma = z.object({
  loeysing: loeysingSchema,
  forside: z.undefined(),
  navigasjonsmeny: z.undefined(),
  bilder: z.undefined(),
  overskrifter: z.undefined(),
  artikkel: z.undefined(),
  skjema: z.undefined(),
  tabell: z.undefined(),
  knapper: z.undefined(),
});

const verksemdLoeysingRelationSchema = z
  .object({
    verksemd: z.any(),
    manualVerksemd: z.any(),
    loeysingList: z
      .array(loeysingNettsideRelationScehma.optional())
      .min(1, 'Ein vermeksemd må ha minst ei løysing for testing'),
  })
  .refine(
    (verksemdLoeysing) =>
      verksemdLoeysing.loeysingList.every(
        (loeysingRelation) =>
          loeysingRelation?.loeysing?.id !== 0 &&
          isDefined(loeysingRelation?.loeysing?.id)
      ),
    {
      message: 'Nokre felt manglar løysing',
      path: ['loeysingList'],
    }
  )
  .refine(
    (verksemdLoeysing) => {
      return (
        new Set(
          verksemdLoeysing.loeysingList.map(
            (loeysingRelation) => loeysingRelation?.loeysing?.id
          )
        ).size === verksemdLoeysing.loeysingList.length
      );
    },
    {
      message: 'Løsyingar må være unike',
      path: ['loeysingList'],
    }
  );

export const sakLoeysingValidationSchemaInngaaende = z.object({
  verksemdLoeysingRelation: verksemdLoeysingRelationSchema,
});
