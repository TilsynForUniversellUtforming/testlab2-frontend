import { isDefined } from '@common/util/validationUtils';
import { z } from 'zod';

export const sideutvalValidationSchema = z.object({
  sideutval: z.array(
    z
      .object({
        loeysingId: z.number().positive('Løysing er påkrevd'),
        typeId: z.number().positive('Type er pårkrevd'),
        begrunnelse: z.string().optional(),
        url: z.string().min(1, 'Ugyldig url').or(z.literal('')),
        egendefinertType: z
          .string()
          .min(1, 'Ugyldig egendefinert type')
          .optional()
          .or(z.literal('')),
      })
  ),
});
