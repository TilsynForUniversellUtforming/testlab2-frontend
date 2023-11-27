import { z } from 'zod';

const testregelSchema = z.object({
  id: z.number(),
  krav: z.string(),
  testregelSchema: z.string(),
  name: z.string(),
});

export const sakTestreglarValidationSchemaForenklet = z.object({
  testregelList: z.array(testregelSchema).min(1, 'Testreglar må veljast'),
});
