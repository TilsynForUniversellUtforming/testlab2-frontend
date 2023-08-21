import { z } from 'zod';

export const testreglarValidationSchema = z.object({
  kravTilSamsvar: z.string().nonempty('Namn kan ikkje vera tomt'),
  testregelNoekkel: z
    .string()
    .nonempty('Testregel test-id kan ikkje vera tom')
    .refine(
      (value) => /^(QW-ACT-R)[0-9]{1,2}$/i.test(value),
      'Format på testregel er QW-ACT-RXX'
    ),
  krav: z
    .string()
    .optional()
    .refine(
      (value) => value !== undefined && value !== '',
      'Krav sak må vejast'
    ),
});
