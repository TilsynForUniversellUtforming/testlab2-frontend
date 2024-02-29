import { sakLoeysingValidationSchemaForenklet } from '@sak/form/steps/loeysing/forenklet/sakLoeysingValidationSchemaForenklet';
import { z } from 'zod';

export const sakTestreglarValidationSchemaForenklet = z
  .object({
    testregelList: z.array(z.any()).min(1, 'Testreglar må veljast'),
  })
  .and(sakLoeysingValidationSchemaForenklet);
