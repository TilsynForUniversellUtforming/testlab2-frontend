import { z } from 'zod';

export const regelsettValidationSchema = z.object({
  namn: z.string().nonempty('Namn kan ikkje vera tomt'),
  standard: z.boolean(),
  modus: z.union([
    z.literal('automatisk'),
    z.literal('manuell'),
    z.literal('semi-automatisk'),
  ]),
  testregelList: z.array(z.any()).min(1, 'Må velja minst ein testregel'),
});
