import { testregelSchema } from '@testreglar/testreglar-liste/testreglarValidationSchema';
import { z } from 'zod';

export const regelsettValidationSchema = z.object({
  namn: z.string().nonempty('Namn kan ikkje vera tomt'),
  standard: z.boolean(),
  type: z.union([z.literal('forenklet'), z.literal('manuell')]),
  testregelList: z
    .array(testregelSchema.and(z.object({ id: z.number() })))
    .min(1, 'Må velja minst ein testregel'),
});
