import { testregelSchema } from '@testreglar/testreglar-liste/testreglarValidationSchema';
import { z } from 'zod';

export const sakTestreglarValidationSchemaInngaaende = z.object({
  sakId: z.number(),
  verksemdLoeysingRelation: z.any(),
  testregelList: z.array(testregelSchema).min(1, 'Testreglar må veljast'),
});
