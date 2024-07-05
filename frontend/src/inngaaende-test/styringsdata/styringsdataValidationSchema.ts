import { isValidObject } from '@common/util/validationUtils';
import { z } from 'zod';

const resultatKlageSchema = z.union([
  z.literal('stadfesta'),
  z.literal('delvis-omgjort'),
  z.literal('omgjort'),
  z.literal('oppheva'),
]);

const botOekingSchema = z.union([
  z.literal('kroner'),
  z.literal('prosent'),
  z.literal('ikkje-relevant'),
]);

const reaksjonsType = z.union([
  z.literal('reaksjon'),
  z.literal('ingen-reaksjon'),
]);

const paaleggSchema = z
  .object({
    vedtakDato: z.coerce
      .date({ message: 'Ugyldig dato' })
      .optional()
      .or(z.literal('')),
    frist: z.coerce
      .date({ message: 'Ugyldig dato' })
      .optional()
      .or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    const { vedtakDato, frist } = data;

    if (frist && vedtakDato && frist < vedtakDato) {
      ctx.addIssue({
        code: 'custom',
        message: 'Frist må vera etter vedtaksdato',
        path: ['frist'],
      });
    }
  });

const botSchema = z
  .object({
    beloepDag: z.coerce
      .number()
      .positive('Bot må vera positiv')
      .optional()
      .or(z.literal('')),
    oekingEtterDager: z.coerce
      .number()
      .positive('Øking må vera positiv')
      .optional()
      .or(z.literal('')),
    oekningType: botOekingSchema.optional().or(z.literal('')),
    oekingSats: z.coerce
      .number()
      .positive('Sats må vera positiv')
      .optional()
      .or(z.literal('')),
    vedtakDato: z.coerce
      .date({ message: 'Ugyldig dato' })
      .optional()
      .or(z.literal('')),
    startDato: z.coerce
      .date({ message: 'Ugyldig dato' })
      .optional()
      .or(z.literal('')),
    sluttDato: z.coerce
      .date({ message: 'Ugyldig dato' })
      .optional()
      .or(z.literal('')),
    kommentar: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const {
      beloepDag,
      oekingEtterDager,
      oekingSats,
      vedtakDato,
      startDato,
      sluttDato,
    } = data;

    if ((beloepDag || oekingSats) && !oekingEtterDager) {
      ctx.addIssue({
        code: 'custom',
        message: 'Øking manglar',
        path: ['oekingEtterDager'],
      });
    }

    if ((oekingEtterDager || oekingSats) && !beloepDag) {
      ctx.addIssue({
        code: 'custom',
        message: 'Beløp manglar',
        path: ['beloepDag'],
      });
    }

    if ((oekingEtterDager || beloepDag) && !oekingSats) {
      ctx.addIssue({
        code: 'custom',
        message: 'Sats manglar',
        path: ['oekingSats'],
      });
    }

    if (startDato && vedtakDato && startDato < vedtakDato) {
      ctx.addIssue({
        code: 'custom',
        message: 'Startdato kan ikkje vera før vedtaket',
        path: ['startDato'],
      });
    }

    if (sluttDato && vedtakDato && sluttDato < vedtakDato) {
      ctx.addIssue({
        code: 'custom',
        message: 'Sluttdato kan ikkje vera før vedtaket',
        path: ['sluttDato'],
      });
    }
  });

const klageSchema = z
  .object({
    klageMottattDato: z.coerce
      .date({ message: 'Ugyldig dato' })
      .optional()
      .or(z.literal('')),
    klageAvgjortDato: z.coerce
      .date({ message: 'Ugyldig dato' })
      .optional()
      .or(z.literal('')),
    resultatKlageTilsyn: resultatKlageSchema.optional().or(z.literal('')),
    klageDatoDepartement: z.coerce
      .date({ message: 'Ugyldig dato' })
      .optional()
      .or(z.literal('')),
    resultatKlageDepartement: resultatKlageSchema.optional().or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    const {
      klageMottattDato,
      klageAvgjortDato,
      resultatKlageTilsyn,
      klageDatoDepartement,
      resultatKlageDepartement,
    } = data;

    if (klageAvgjortDato && !klageMottattDato) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mottat dato er påkrevd',
        path: ['klageMottattDato'],
      });
    }

    if (
      klageMottattDato &&
      klageAvgjortDato &&
      klageAvgjortDato < klageMottattDato
    ) {
      ctx.addIssue({
        code: 'custom',
        message: 'Dato for avgjort klage må vera etter klagedato',
        path: ['klageAvgjortDato'],
      });
    }

    if (klageAvgjortDato && !resultatKlageTilsyn) {
      ctx.addIssue({
        code: 'custom',
        message: 'Resultat manglar',
        path: ['resultatKlageTilsyn'],
      });
    }

    if (resultatKlageTilsyn && !klageAvgjortDato) {
      ctx.addIssue({
        code: 'custom',
        message: 'Avgjort dato manglar',
        path: ['klageAvgjortDato'],
      });
    }

    if (resultatKlageDepartement && !klageDatoDepartement) {
      ctx.addIssue({
        code: 'custom',
        message: 'Sendt dato manglar',
        path: ['klageDatoDepartement'],
      });
    }
  });

export const styringsdataValidationSchema = z
  .object({
    ansvarleg: z.string().min(1, 'Ansvarleg manglar'),
    oppretta: z.coerce
      .date({ message: 'Ugyldig dato' })
      .optional()
      .or(z.literal('')),
    frist: z.coerce
      .date({ message: 'Ugyldig dato' })
      .optional()
      .or(z.literal('')),
    reaksjon: reaksjonsType,
    paalegg: paaleggSchema.optional(),
    paaleggKlage: klageSchema.optional(),
    bot: botSchema.optional(),
    botKlage: klageSchema.optional(),
  })
  .passthrough()
  .superRefine((data, ctx) => {
    const { oppretta, frist } = data;

    if (frist && oppretta && frist < oppretta) {
      ctx.addIssue({
        code: 'custom',
        message: 'Frist må vera etter oppretta dato',
        path: ['frist'],
      });
    }

    if (
      !isValidObject(data.paalegg) &&
      isValidObject(data.paaleggKlage, false)
    ) {
      ctx.addIssue({
        code: 'custom',
        message: 'Vedtaksdato manglar',
        path: ['paalegg'],
      });
    }
    if (!isValidObject(data.bot) && isValidObject(data.botKlage, false)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Vedtaksdato manglar',
        path: ['bot'],
      });
    }
  });
