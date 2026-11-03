import { z } from 'zod';

export const kontrollInitValidationSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(Number).optional(),
  kontrolltype: z.union([
    z.literal('inngaaende-kontroll'),
    z.literal('forenkla-kontroll'),
    z.literal('tilsyn'),
    z.literal('statusmaaling'),
    z.literal('uttalesak'),
    z.literal('anna'),
  ]),

  tittel: z.string().min(1, 'Tittel må fyllast ut'),

  saksbehandler: z.string().min(1, 'Saksbehandlar må fyllast ut'),

  arkivreferanse: z.string().optional(),
});

export type KontrollInit = z.input<typeof kontrollInitValidationSchema>;
