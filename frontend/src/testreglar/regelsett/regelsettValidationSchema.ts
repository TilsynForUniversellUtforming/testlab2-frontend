import { z } from 'zod';

export const regelsettValidationSchema = z.object({
  namn: z.string().nonempty('Namn kan ikkje vera tomt'),
  standard: z.boolean(),
  modus: z.union([z.literal('forenklet'), z.literal('manuell')]),
  testregelList: z.array(z.any()).min(1, 'Må velja minst ein testregel'),
});
