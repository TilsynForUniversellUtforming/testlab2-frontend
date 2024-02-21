import { fristSchema } from '@sak/form/steps/init/sakFormValidationSchema';
import { testregelBaseScehma } from '@testreglar/testreglar-liste/testreglarValidationSchema';
import { z } from 'zod';

export const sakTestreglarValidationSchemaInngaaende = z.object({
  sakId: z.number(),
  verksemdLoeysingRelation: z.any(),
  frist: fristSchema,
  testregelList: z.array(testregelBaseScehma).min(1, 'Testreglar må veljast'),
});
