import { dateIsBefore, isValidInputDate } from '@common/util/stringutils';
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
    vedtakDato: z.nullable(z.string()).optional().or(z.literal('')),
    frist: z.nullable(z.string()).optional().or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    const { vedtakDato, frist } = data;
    const validVedtakDato = isValidInputDate(vedtakDato);
    const validFrist = isValidInputDate(frist);

    if (validVedtakDato && validFrist && dateIsBefore(vedtakDato, frist)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Frist må vera etter vedtaksdato',
        path: ['frist'],
      });
    }
  });

const botSchema = z
  .object({
    beloepDag: z
      .literal('')
      .or(z.coerce.number().positive('Bot må vera positiv').optional()),
    oekingEtterDager: z.coerce
      .number()
      .positive('Øking må vera positiv')
      .optional()
      .or(z.literal('')),
    oekningType: z.nullable(botOekingSchema.optional().or(z.literal(''))),
    oekingSats: z.coerce
      .number()
      .positive('Sats må vera positiv')
      .optional()
      .or(z.literal('')),
    vedtakDato: z.nullable(z.string()).optional().or(z.literal('')),
    startDato: z.nullable(z.string()).optional().or(z.literal('')),
    sluttDato: z.nullable(z.string()).optional().or(z.literal('')),
    kommentar: z.nullable(z.string().optional()),
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

    if (beloepDag || oekingEtterDager || oekingSats) {
      if (!vedtakDato) {
        ctx.addIssue({
          code: 'custom',
          message: 'Vedtakdato manglar',
          path: ['vedtakDato'],
        });
      }
      if (!startDato) {
        ctx.addIssue({
          code: 'custom',
          message: 'Startdato manglar',
          path: ['startDato'],
        });
      }
    }

    if (startDato && vedtakDato && dateIsBefore(vedtakDato, startDato)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Startdato kan ikkje vera før vedtaket',
        path: ['startDato'],
      });
    }

    if (sluttDato && vedtakDato && dateIsBefore(vedtakDato, sluttDato)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Sluttdato kan ikkje vera før vedtaket',
        path: ['sluttDato'],
      });
    }
  });

const klageSchema = z
  .object({
    klageMottattDato: z.nullable(z.string()).optional().or(z.literal('')),
    klageAvgjortDato: z.nullable(z.string()).optional().or(z.literal('')),
    resultatKlageTilsyn: z.nullable(
      resultatKlageSchema.optional().or(z.literal(''))
    ),
    klageDatoDepartement: z.nullable(z.string()).optional().or(z.literal('')),
    resultatKlageDepartement: z.nullable(
      resultatKlageSchema.optional().or(z.literal(''))
    ),
  })
  .superRefine((data, ctx) => {
    const {
      klageMottattDato,
      klageAvgjortDato,
      resultatKlageTilsyn,
      klageDatoDepartement,
      resultatKlageDepartement,
    } = data;

    const validMottattDato = isValidInputDate(klageMottattDato);
    const validAvgjortDato = isValidInputDate(klageAvgjortDato);
    const validDatoDepartement = isValidInputDate(klageDatoDepartement);

    if (validAvgjortDato && !validMottattDato) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mottat dato er påkrevd',
        path: ['klageMottattDato'],
      });
    }

    if (
      validMottattDato &&
      validAvgjortDato &&
      dateIsBefore(klageMottattDato, klageAvgjortDato)
    ) {
      ctx.addIssue({
        code: 'custom',
        message: 'Dato for avgjort klage må vera etter klagedato',
        path: ['klageAvgjortDato'],
      });
    }

    if (validAvgjortDato && !resultatKlageTilsyn) {
      ctx.addIssue({
        code: 'custom',
        message: 'Resultat manglar',
        path: ['resultatKlageTilsyn'],
      });
    }

    if (resultatKlageTilsyn && !validAvgjortDato) {
      ctx.addIssue({
        code: 'custom',
        message: 'Avgjort dato manglar',
        path: ['klageAvgjortDato'],
      });
    }

    if (resultatKlageDepartement && !validDatoDepartement) {
      ctx.addIssue({
        code: 'custom',
        message: 'Sendt dato manglar',
        path: ['klageDatoDepartement'],
      });
    }

    if (validDatoDepartement && !resultatKlageDepartement) {
      ctx.addIssue({
        code: 'custom',
        message: 'Resultat manglar',
        path: ['resultatKlageDepartement'],
      });
    }
  });

export const styringsdataValidationSchema = z
  .object({
    ansvarleg: z.string().min(1, 'Ansvarleg manglar'),
    oppretta: z.nullable(z.string()).optional().or(z.literal('')),
    frist: z.nullable(z.string()).optional().or(z.literal('')),
    reaksjon: reaksjonsType,
    paaleggReaksjon: z.nullable(reaksjonsType.optional()),
    paaleggKlageReaksjon: z.nullable(reaksjonsType.optional()),
    botReaksjon: z.nullable(reaksjonsType.optional()),
    botKlageReaksjon: z.nullable(reaksjonsType.optional()),
    paalegg: z.nullable(paaleggSchema.optional()),
    paaleggKlage: z.nullable(klageSchema.optional()),
    bot: z.nullable(botSchema.optional()),
    botKlage: z.nullable(klageSchema.optional()),
  })
  .passthrough()
  .superRefine((data, ctx) => {
    const {
      oppretta,
      frist,
      paalegg,
      paaleggKlage,
      bot,
      botKlage,
      paaleggReaksjon,
      paaleggKlageReaksjon,
      botReaksjon,
      botKlageReaksjon,
    } = data;

    const hasPaaleggReaksjon = paaleggReaksjon === 'reaksjon';
    const hasPaaleggKlageReaksjon = paaleggKlageReaksjon === 'reaksjon';
    const hasBotReaksjon = botReaksjon === 'reaksjon';
    const hasBotKlageReaksjon = botKlageReaksjon === 'reaksjon';

    const validOppretta = isValidInputDate(oppretta);
    const validFrist = isValidInputDate(frist);

    if (validOppretta && validFrist && dateIsBefore(oppretta, frist)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Frist må vera etter oppretta dato',
        path: ['frist'],
      });
    }

    if (!isValidObject(paalegg, false) && isValidObject(paaleggKlage, false)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Vedtaksdato manglar',
        path: ['paalegg'],
      });
    }
    if (!isValidObject(bot, false) && isValidObject(botKlage, false)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Vedtaksdato manglar',
        path: ['bot'],
      });
    }

    if (
      (hasPaaleggKlageReaksjon || hasBotReaksjon || hasBotKlageReaksjon) &&
      !hasPaaleggReaksjon
    ) {
      ctx.addIssue({
        code: 'custom',
        message:
          'Pålegg om retting manglar, kan ikkje legge inn andre reaksjonar',
        path: ['paaleggReaksjon'],
      });

      if (hasPaaleggKlageReaksjon) {
        ctx.addIssue({
          code: 'custom',
          message: 'Pålegg om retting manglar',
          path: ['paaleggKlageReaksjon'],
        });
      }

      if (hasBotReaksjon) {
        ctx.addIssue({
          code: 'custom',
          message: 'Pålegg om retting manglar',
          path: ['botReaksjon'],
        });
      }

      if (hasBotKlageReaksjon) {
        ctx.addIssue({
          code: 'custom',
          message: 'Pålegg om retting manglar',
          path: ['botKlageReaksjon'],
        });
      }
    }

    if (hasBotKlageReaksjon && !hasBotReaksjon) {
      ctx.addIssue({
        code: 'custom',
        message: 'Det må liggja føre bot før klage',
        path: ['botReaksjon'],
      });
    }
  });
