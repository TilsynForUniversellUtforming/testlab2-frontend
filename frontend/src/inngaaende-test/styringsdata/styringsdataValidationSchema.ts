import { z } from 'zod';

const resultatKlageSchema = z.union([
  z.literal('stadfesta'),
  z.literal('delvis-omgjort'),
  z.literal('omgjort'),
  z.literal('oppheva')
]);

const klageTypeSchema = z.union([
  z.literal('paalegg'),
  z.literal('bot')
]);

const botOekingShema = z.union([
  z.literal('kroner'),
  z.literal('prosent'),
  z.literal('ikkje-relevant')
]);

const paaleggShema = z.object({
  vedtakDato: z.coerce.date({ message: 'Ugyldig dato' }).or(z.literal('')),
  frist: z.coerce.date({ message: 'Ugyldig dato' }).or(z.literal('')),
}).superRefine((data, ctx) => {
  if (!!data.vedtakDato !== !!data.frist) {
    ctx.addIssue({
      code: 'custom',
      message: 'Både vedtak og frist må settes',
      path: [`${!!data.vedtakDato ? 'frist' : 'vedtakDato'}`]
    });
  }

  if (data.frist < data.vedtakDato) {
    ctx.addIssue({
      code: 'custom',
      message: 'Frist må være etter vedtaksdato',
      path: ['frist']
    });
  }
})

const botSchema = z.object({
  beloepDag: z.coerce.number().positive('Bot må vera positiv'),
  oekingEtterDater: z.coerce.number().positive('Øking må vera positiv'),
  oekningType: botOekingShema,
  oekingSats: z.coerce.number().positive('Sats må vera positiv'),
  vedakDato: z.string().date('Ugyldig dato'),
  startDato: z.string().date('Ugyldig dato'),
  sluttDato: z.string().date('Ugyldig dato'),
  kommentar: z.string().optional(),
});

const klageSchema = z.object({
  klageType: klageTypeSchema,
  klageMottattDato: z.string().date('Ugyldig dato'),
  klageAvgjortDato: z.string().date('Ugyldig dato').optional()
    .or(z.literal('')),
  resultatKlageTilsyn: resultatKlageSchema.optional(),
  klageDatoDepartement: z.string().date('Ugyldig dato').optional()
    .or(z.literal('')),
  resultatKlageDepartement: resultatKlageSchema.optional(),
});

export const styringsdataValidationSchema = z.object({
  ansvarlig: z.string().min(1, 'Mangler ansvarlig'),
  opprettet: z.string().date('Ugyldig dato'),
  frist: z.string().date('Ugyldig dato'),
  reaksjon: z.coerce.boolean(),
  paalegg: paaleggShema,
  paaleggKlage: klageSchema.optional(),
  bot: botSchema.optional(),
  botKlage: klageSchema.optional(),
})

