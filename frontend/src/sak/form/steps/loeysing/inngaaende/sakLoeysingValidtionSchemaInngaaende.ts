import { isDefined } from '@common/util/validationUtils';
import { loeysingSchema } from '@sak/form/steps/sakFormValidationSchema';
import { z } from 'zod';

export const verksemdLoeysingRelationSchema = z
  .object({
    verksemd: loeysingSchema,
    loeysingList: z
      .array(loeysingSchema.optional())
      .min(1, 'Ein vermeksemd må ha minst ei løysing for testing'),
  })
  .refine(
    (verksemdLoeysing) =>
      verksemdLoeysing.loeysingList.every(
        (loeysing) => loeysing?.id !== 0 && isDefined(loeysing?.id)
      ),
    {
      message: 'Nokre felt manglar løysing',
      path: ['loeysingList'],
    }
  )
  .refine(
    (verksemdLoeysing) => {
      return (
        new Set(verksemdLoeysing.loeysingList.map((loeysing) => loeysing?.id))
          .size === verksemdLoeysing.loeysingList.length
      );
    },
    {
      message: 'Løsyingar må være unike',
      path: ['loeysingList'],
    }
  );

export const sakLoeysingValidationSchemaInngaaende = z.object({
  verksemd: verksemdLoeysingRelationSchema,
});
