import { z } from 'zod';

export const testregelSchema = z.object({
  id: z.number().optional(),
  name: z.string().nonempty('Namn kan ikkje vera tomt'),
  testregelSchema: z.string().nonempty('Testregel test-id kan ikkje vera tom'),
  krav: z
    .string()
    .optional()
    .refine(
      (value) => value !== undefined && value !== '',
      'Krav sak må vejast'
    ),
  type: z.union([z.literal('forenklet'), z.literal('inngaaende')]),
});

export const testreglarValidationSchema = testregelSchema
  .refine(
    (data) => {
      if (data.type === 'forenklet') {
        return /^(QW-ACT-R)[0-9]{1,2}$/i.test(data.testregelSchema);
      }
      return true;
    },
    { message: 'Format på testregel er QW-ACT-RXX', path: ['testregelSchema'] }
  )
  .refine(
    (data) => {
      if (data.type === 'inngaaende') {
        try {
          JSON.parse(data.testregelSchema);
          return true;
        } catch (e) {
          return false;
        }
      }

      return true;
    },
    { message: 'Ugyldig JSON-format', path: ['testregelSchema'] }
  );
