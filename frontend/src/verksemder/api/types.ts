import { AppContext } from '@common/types';

export type Verksemd = {
  id: number;
  namn: string;
  organisasjonsnummer: string;
  institusjonellSektorkode: string;
  institusjonellSektorkodeBeskrivelse: string;
  naeringskode: string;
  naeringskodeBeskrivelse: string;
  organisasjonsformKode: string;
  organsisasjonsformOmtale: string;
  fylkesnummer: string;
  fylke: string;
  kommune: string;
  kommunenummer: string;
  postnummer: string;
  poststad: string;
  talTilsette: number;
  forvaltningsnivaa: string;
  tenesteromraade: string;
  aktiv: boolean;
  original: number;
  underAvviking: boolean;
};
export type VerksemdInit = {
  organisasjonsnummer: string;
};

export interface VerksemdContext extends AppContext {
  verksemdList: Verksemd[];
  setVerksemdList: (verksemderList: Verksemd[]) => void;
}
