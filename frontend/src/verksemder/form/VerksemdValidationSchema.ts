import { z } from 'zod';
export const verksemdValidationSchema = z.object({
  namn: z.string().min(1, 'Namn er påkrevd'),
  organisasjonsnummer: z.string().min(1, 'Organisasjonsnummer er påkrevd'),
  institusjonellSektorkode: z
    .string()
    .min(1, 'Institusjonell sektorkode er påkrevd'),
  institusjonellSektorkodeBeskrivelse: z
    .string()
    .min(1, 'Institusjonell sektorkode beskrivelse er påkrevd'),
  naeringskode: z.string().min(1, 'Næringskode er påkrevd'),
  naeringskodeBeskrivelse: z
    .string()
    .min(1, 'Næringskode beskrivelse er påkrevd'),
  organisasjonsformKode: z.string().min(1, 'Organisasjonsform kode er påkrevd'),
  organisasjonsformOmtale: z
    .string()
    .min(1, 'Organisasjonsform omtale er påkrevd'),
  fylkesnummer: z.string().min(1, 'Fylkesnummer er påkrevd'),
  fylke: z.string().min(1, 'Fylke er påkrevd'),
  kommune: z.string().min(1, 'Kommune er påkrevd'),
  kommunenummer: z.string().min(1, 'Kommunenummer er påkrevd'),
  postnummer: z.string().min(1, 'Postnummer er påkrevd'),
  poststad: z.string().min(1, 'Poststad er påkrevd'),
  talTilsette: z.number().min(1, 'Tal tilsette er påkrevd'),
  forvaltningsnivaa: z.string().min(1, 'Forvaltningsnivå er påkrevd'),
  tenesteromraade: z.string().min(1, 'Tenesteromraade er påkrevd'),
  underAvviking: z.boolean({
    required_error: 'Under avvikling er påkrevd',
  }),
});
