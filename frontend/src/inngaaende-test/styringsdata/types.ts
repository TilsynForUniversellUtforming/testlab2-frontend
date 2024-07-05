export type ResultatKlage =
  | 'stadfesta'
  | 'delvis-omgjort'
  | 'omgjort'
  | 'oppheva';

export type KlageType = 'paalegg' | 'bot';

export type BotOekningType = 'kroner' | 'prosent' | 'ikkje-relevant';

export type ReaksjonsType = 'reaksjon' | 'ingen-reaksjon';

export type Paalegg = {
  id?: number;
  vedtakDato: Date;
  frist: Date;
};

export type Klage = {
  id?: number;
  klageType: KlageType;
  klageMottattDato: Date;
  klageAvgjortDato?: Date;
  resultatKlageTilsyn?: ResultatKlage;
  klageDatoDepartement?: Date;
  resultatKlageDepartement?: ResultatKlage;
};

type Bot = {
  id?: number;
  beloepDag: number;
  oekingEtterDager: number;
  oekningType: BotOekningType;
  oekingSats: number;
  vedtakDato: Date;
  startDato: Date;
  sluttDato?: Date;
  kommentar?: string;
};

export type Styringsdata = {
  id?: number;
  loeysingId: number;
  kontrollId: number;
  ansvarleg: string;
  oppretta: Date;
  frist: Date;
  reaksjon: ReaksjonsType;
  paalegg?: Paalegg;
  paaleggKlage?: Klage;
  bot?: Bot;
  botKlage?: Klage;
};

export type StyringsdataFormData = {
  id?: number;
  ansvarleg: string;
  oppretta: Date;
  frist: Date;
  reaksjon: ReaksjonsType;
  paalegg?: Paalegg;
  paaleggKlage?: Klage;
  bot?: Bot;
  botKlage?: Klage;
};

export type StyringsdataListElement = {
  id: number;
  kontrollId: number;
  loeysingId: number;
  ansvarleg: string;
  oppretta: string;
  frist: string;
  reaksjon: ReaksjonsType;
  paaleggId?: number;
  paaleggKlageId?: number;
  botId?: number;
  botKlageId?: number;
};

export type StyringsdataLoaderData = {
  kontrollTittel: string;
  arkivreferanse: string;
  loeysingNamn: string;
  verksemdNamn: string;
  styringsdata: Styringsdata | undefined;
};
