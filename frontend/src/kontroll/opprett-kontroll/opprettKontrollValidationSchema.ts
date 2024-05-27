import { z } from 'zod';

export const opprettKontrollValidationSchema = z.object({
  kontrolltype: z
    .union([
      z.literal('inngaaende-kontroll'),
      z.literal('forenkla-kontroll'),
      z.literal('tilsyn'),
      z.literal('statusmaaling'),
      z.literal('uttalesak'),
      z.literal('anna'),
    ])
    .refine(
      (val) => val === 'inngaaende-kontroll' || val === 'forenkla-kontroll',
      { message: 'Kontrolltype må væra inngående eller forenkla kontroll' }
    ),

  tittel: z.string().min(1, 'Tittel må fyllast ut'),

  saksbehandler: z.string().min(1, 'Saksbehandlar må fyllast ut'),

  sakstype: z.union([z.literal('forvaltningssak'), z.literal('arkivsak')], {
    message: 'Du må velje ein sakstype',
  }),

  arkivreferanse: z.string().optional(),
});

export type CreateKontrollType = z.input<
  typeof opprettKontrollValidationSchema
>;
