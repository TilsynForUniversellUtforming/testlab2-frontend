import { sakLoeysingValidationSchemaForenklet } from '@sak/form/steps/loeysing/forenklet/sakLoeysingValidationSchemaForenklet';
import { testregelBaseScehma } from '@testreglar/testreglar-liste/testreglarValidationSchema';
import { z } from 'zod';

export const sakTestreglarValidationSchemaForenklet = z
  .object({
    testregelList: z.array(testregelBaseScehma).min(1, 'Testreglar må veljast'),
  })
  .and(sakLoeysingValidationSchemaForenklet);
