import { fristSchema } from '@sak/form/steps/init/sakFormValidationSchema';
import { z } from 'zod';

export const sakTestreglarValidationSchemaInngaaende = z.object({
  sakId: z.number(),
  verksemdLoeysingRelation: z.any(),
  frist: fristSchema,
  testregelList: z.array(z.any()).min(1, 'Testreglar må veljast'),
});
