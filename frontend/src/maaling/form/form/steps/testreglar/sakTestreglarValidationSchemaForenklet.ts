import { sakLoeysingValidationSchemaForenklet } from '@maaling/form/form/steps/loeysing/sakLoeysingValidationSchemaForenklet';
import { z } from 'zod';

export const sakTestreglarValidationSchemaForenklet = z
  .object({
    testregelList: z.array(z.any()).min(1, 'Testreglar må veljast'),
  })
  .and(sakLoeysingValidationSchemaForenklet);
