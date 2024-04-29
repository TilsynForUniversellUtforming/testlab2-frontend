import { z } from 'zod';

export const sideutvalValidationSchema =
  z.object({
    sideutval: z
      .array(
        z.object({
          loeysingId: z.number().positive('Løysing er påkrevd'),
          objektId: z.number().positive('Testobjekt er pårkrevd'),
          begrunnelse: z.string().min(1, 'Sideutval må ha beskrivelse'),
          url: z.string().url('Ugyldig url'),
          egendefinertObjekt: z
            .string()
            .min(1, 'Ugyldig egendefinert type')
            .optional()
            .or(z.literal('')),
        })
      )
  });

