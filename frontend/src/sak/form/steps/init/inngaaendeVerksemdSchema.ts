import {
  isDefined,
  isOrgnummer,
  isValidObject,
} from '@common/util/validationUtils';
import { z } from 'zod';

export const orgnummerSchema = z
  .string()
  .nonempty('Organisasjonsnummer kan ikkje vera tom')
  .refine(
    (value) => isOrgnummer(value),
    'Dette er ikkje eit gyldig organisasjonsnummer'
  );

export const loeysingSchema = z.object({
  id: z.number().positive('Løysing manlgar id'),
  namn: z.string().min(1, 'Løysing må ha namn'),
  url: z.string().url('Løysing må ha url'),
  orgnummer: orgnummerSchema,
});

const loeysingNettsideRelationScehma = z.object({
  loeysing: loeysingSchema,
  forside: z.undefined(),
  navigasjonsmeny: z.undefined(),
  bilder: z.undefined(),
  overskrifter: z.undefined(),
  artikkel: z.undefined(),
  skjema: z.undefined(),
  tabell: z.undefined(),
  knapper: z.undefined(),
});

const verksemdLoeysingRelationSchema = z
  .object({
    loeysingList: z
      .array(loeysingNettsideRelationScehma.optional())
      .min(1, 'Ein vermeksemd må ha minst ei løysing for testing'),
  })
  .refine(
    (verksemdLoeysing) =>
      verksemdLoeysing.loeysingList.every(
        (loeysingRelation) =>
          loeysingRelation?.loeysing?.id !== 0 &&
          isDefined(loeysingRelation?.loeysing?.id)
      ),
    {
      message: 'Nokre felt manglar løysing',
      path: ['loeysingList'],
    }
  )
  .refine(
    (verksemdLoeysing) => {
      return (
        new Set(
          verksemdLoeysing.loeysingList.map(
            (loeysingRelation) => loeysingRelation?.loeysing?.id
          )
        ).size === verksemdLoeysing.loeysingList.length
      );
    },
    {
      message: 'Løsyingar må være unike',
      path: ['loeysingList'],
    }
  );

export const verksemdInitSchema = z.object({
  namn: z.string().min(1, 'Ei verksemd må ha eit namn'),
  orgnummer: orgnummerSchema,
  ceo: z.string().min(1, 'Ei verksemd må ha ein dagleg leiar'),
  contactPerson: z.string().min(1, 'Ei verksemd må ha ein kontaktperson'),
});

const inngaaendeVerksemdSchemaSelection = z
  .object({
    verksemd: loeysingSchema
      .optional()
      .refine((data) => isDefined(data), 'Verksemd må veljast'),
    manualVerksemd: z.any().optional(),
  })
  .and(verksemdLoeysingRelationSchema);

const inngaaendeVerksemdSchemaManual = z
  .object({
    verksemd: loeysingSchema.partial().optional(),
    manualVerksemd: verksemdInitSchema,
  })
  .and(verksemdLoeysingRelationSchema)
  .refine(
    (data) => {
      return isDefined(data.verksemd) || isValidObject(data.manualVerksemd);
    },
    { message: 'Verksemd må veljast', path: ['verksemd'] }
  );

export const inngaaendeVerksemdSchema = inngaaendeVerksemdSchemaManual.or(
  inngaaendeVerksemdSchemaSelection
);
