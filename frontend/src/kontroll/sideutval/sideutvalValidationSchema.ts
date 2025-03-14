import { isDefined, isNotDefined } from '@common/util/validationUtils';
import { z } from 'zod';

export const sideutvalValidationSchema = z.object({
  sideutval: z.array(
    z
      .object({
        loeysingId: z.number().positive('Løysing er påkrevd'),
        typeId: z.number().positive('Type er pårkrevd'),
        begrunnelse: z.string().min(1, 'Sideutval må ha begrunnelse'),
        url: z.string().min(1, 'Ugyldig url').optional().or(z.literal('')),
        egendefinertType: z
          .string()
          .min(1, 'Ugyldig egendefinert type')
          .optional()
          .or(z.literal('')),
      })
      .refine(
        ({ url, begrunnelse }) => isDefined(url) === isDefined(begrunnelse),
        ({ url }) => {
          if (isNotDefined(url)) {
            return { message: 'Ugyldig url', path: ['url'] };
          }
          return {
            message: 'Sideutval må ha begrunnelse',
            path: ['begrunnelse'],
          };
        }
      )
  ),
});
