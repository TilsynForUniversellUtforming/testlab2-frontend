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
  vedtakDato: string;
  frist: string;
};

export type Klage = {
  id?: number;
  klageType: KlageType;
  klageMottattDato: string;
  klageAvgjortDato?: string;
  resultatKlageTilsyn?: ResultatKlage;
  klageDatoDepartement?: string;
  resultatKlageDepartement?: ResultatKlage;
};

type Bot = {
  id?: number;
  beloepDag: number;
  oekingEtterDager: number;
  oekningType?: BotOekningType;
  oekingSats: number;
  vedtakDato: string;
  startDato: string;
  sluttDato?: string;
  kommentar?: string;
};

export type Styringsdata = {
  id?: number;
  loeysingId: number;
  kontrollId: number;
  ansvarleg: string;
  oppretta: string;
  frist: string;
  reaksjon: ReaksjonsType;
  paalegg?: Paalegg;
  paaleggKlage?: Klage;
  bot?: Bot;
  botKlage?: Klage;
  sistLagra?: string;
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
  sistLagra?: string;
};

export type StyringsdataLoaderData = {
  kontrollTittel: string;
  arkivreferanse: string;
  loeysingNamn: string;
  verksemdNamn: string;
  styringsdata: Styringsdata | undefined;
};
