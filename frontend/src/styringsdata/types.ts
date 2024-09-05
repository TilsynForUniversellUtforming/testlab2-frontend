export type ResultatKlage =
  | 'stadfesta'
  | 'delvis-omgjort'
  | 'omgjort'
  | 'oppheva';

export type KlageType = 'paalegg' | 'bot';

export type BotOekningType = 'kroner' | 'prosent' | 'ikkje-relevant';

export type ReaksjonsType = 'reaksjon' | 'ingen-reaksjon';

export type StyringsdataKontrollStatus =
  | 'planlagt'
  | 'paagar'
  | 'avslutta'
  | 'ikkje-aktuell'
  | 'forsinka';

export type Paalegg = {
  id?: number;
  vedtakDato: string;
  frist: string;
};

export type Klage = {
  id?: number;
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

export type StyringsdataKontroll = {
  id?: number;
  kontrollId: number;
  ansvarleg: string;
  oppretta: string;
  frist: string;
  varselSendtDato: string;
  status: StyringsdataKontrollStatus;
  foerebelsRapportSendtDato: string;
  svarFoerebelsRapportDato: string;
  endeligRapportDato: string;
  kontrollAvsluttaDato: string;
  rapportPublisertDato: string;
};

export type StyringsdataLoeysing = {
  id?: number;
  loeysingId: number;
  kontrollId: number;
  ansvarleg: string;
  oppretta: string;
  frist: string;
  reaksjon: ReaksjonsType;
  paaleggReaksjon: ReaksjonsType;
  paaleggKlageReaksjon: ReaksjonsType;
  botReaksjon: ReaksjonsType;
  botKlageReaksjon: ReaksjonsType;
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
  paaleggReaksjon: ReaksjonsType;
  paaleggKlageReaksjon: ReaksjonsType;
  botReaksjon: ReaksjonsType;
  botKlageReaksjon: ReaksjonsType;
  paaleggId?: number;
  paaleggKlageId?: number;
  botId?: number;
  botKlageId?: number;
  sistLagra?: string;
  isPaalegg: boolean;
  isBot: boolean;
};

export type StyringsdataLoaderData = {
  kontrollTittel: string;
  arkivreferanse: string;
  loeysingNamn: string;
  verksemdNamn: string;
  styringsdata: StyringsdataLoeysing | undefined;
};

export type StyringsdataKontrollLoaderData = {
  kontrollTittel: string;
  arkivreferanse: string;
  verksemdNamn: string;
  styringsdata: StyringsdataKontroll | undefined;
};
