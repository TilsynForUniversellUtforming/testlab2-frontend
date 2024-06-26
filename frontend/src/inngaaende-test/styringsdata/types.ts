import { Kontroll } from '../../kontroll/types';

export type ResultatKlage = 'stadfesta' | 'delvis-omgjort' | 'omgjort' | 'oppheva';

export type KlageType = 'paalegg' | 'bot';

export type BotOekningType = 'kroner' | 'prosent' | 'ikkje-relevant';

export type Paalegg = {
  vedtakDato: Date;
  frist: Date;
}

export type Klage = {
  klageType: KlageType;
  klageMottattDato: Date;
  klageAvgjortDato?: Date;
  resultatKlageTilsyn?: ResultatKlage;
  klageDatoDepartement?: Date;
  resultatKlageDepartement?: ResultatKlage;
}

type Bot = {
  beloepDag: number;
  oekingEtterDater: number;
  oekningType: BotOekningType;
  oekingSats: number;
  vedakDato: Date;
  startDato: Date;
  sluttDato: Date;
  kommentar?: string;
};

export type Styringsdata = {
  ansvarlig: string;
  opprettet: Date;
  frist: Date;
  reaksjon: boolean;
  paalegg?: Paalegg;
  paaleggKlage?: Klage;
  bot?: Bot;
  botKlage?: Klage;
}

export type StyringsdataLoaderData = {
  kontroll: Kontroll,
  styringsdata: Styringsdata | undefined;
}