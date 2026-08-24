import { z } from 'zod';

export const regelsettValidationSchema = z.object({
  namn: z.string().nonempty('Namn kan ikkje vera tomt'),
  standard: z.boolean(),
  modus: z.union([
    z.literal('automatisk'),
    z.literal('manuell'),
    z.literal('semi-automatisk'),
    z.literal('deque'),
    z.literal('manuell-forenkla'),
  ]),
  testregelList: z.array(z.any()).min(1, 'Må velja minst ein testregel'),
});

/** Raw form field values, as entered by the user before Zod parses/coerces them. */
export type RegelsettFormInput = z.input<typeof regelsettValidationSchema>;
/** Validated values, as produced by Zod after successful parsing. */
export type RegelsettFormOutput = z.output<typeof regelsettValidationSchema>;

