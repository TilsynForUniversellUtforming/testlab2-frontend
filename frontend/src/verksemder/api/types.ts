import { AppContext } from '@common/types';

export type Verksemd = {
  id: number;
  namn: string;
  organisasjonsnummer: string;
  institusjonellSektorkode: InstitusjonellSektorKode;
  naeringskode: Naeringskode;
  organisasjonsform: Organisasjonsform;
  fylke: Fylke;
  kommune: Kommune;
  postadresse: Postadresse;
  talTilsette: number;
  forvaltningsnivaa: string;
  tenesteromraade: string;
  underAvviking: boolean;
};
export type VerksemdInit = {
  organisasjonsnummer: string;
};

export type VerksemdUpdate = {
  namn: string;
  organisasjonsnummer: string;
  institusjonellSektorkode: string;
  institusjonellSektorkodeBeskrivelse: string;
  naeringskode: string;
  naeringskodeBeskrivelse: string;
  organisasjonsformKode: string;
  organisasjonsformOmtale: string;
  fylkesnummer: string;
  fylke: string;
  kommune: string;
  kommunenummer: string;
  postnummer: string;
  poststad: string;
  talTilsette: number;
  forvaltningsnivaa: string;
  tenesteromraade: string;
  underAvviking: boolean;
};

export interface VerksemdContext extends AppContext {
  verksemdList: Verksemd[];
  setVerksemdList: (verksemderList: Verksemd[]) => void;
}

export type InstitusjonellSektorKode = {
  kode: string;
  beskrivelse: string;
};

export type Naeringskode = {
  kode: string;
  beskrivelse: string;
};

export type Organisasjonsform = {
  kode: string;
  omtale: string;
};

export type Fylke = {
  fylkesnummer: string;
  fylke: string;
};

export type Kommune = {
  kommunenummer: string;
  kommune: string;
};
export type Postadresse = {
  postnummer: string;
  poststad: string;
};
