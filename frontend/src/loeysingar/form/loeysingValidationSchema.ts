import { isOrgnummer, isUrl } from '@common/util/validationUtils';
import { z } from 'zod';

export const loeysingValidationSchema = z.object({
  namn: z.string().nonempty('Namn kan ikkje vera tomt'),

  url: z
    .string()
    .nonempty('URL kan ikkje vera tom')
    .refine(
      (value) => isUrl(value),
      'Ugyldig format, skal være på formatet https://www.uutilsynet.no/'
    ),

  organisasjonsnummer: z
    .string()
    .nonempty('Organisasjonsnummer kan ikkje vera tom')
    .refine(
      (value) => isOrgnummer(value),
      'Dette er ikkje eit gyldig organisasjonsnummer'
    ),
  verksemd: z.optional(z.any()),
});
