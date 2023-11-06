import { z } from 'zod';

const testregelSchema = z.object({
  id: z.number(),
  krav: z.string(),
  testregelNoekkel: z.string(),
  kravTilSamsvar: z.string(),
});

export const sakTestreglarValidationSchemaForenklet = z.object({
  testregelList: z.array(testregelSchema).min(1, 'Testreglar må veljast'),
});
