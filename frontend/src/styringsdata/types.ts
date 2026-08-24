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
  vedtakDato?: string | null;
  frist?: string | null;
};

export type Klage = {
  id?: number;
  klageMottattDato?: string | null;
  klageAvgjortDato?: string | null;
  resultatKlageTilsyn?: ResultatKlage | '' | null;
  klageDatoDepartement?: string | null;
  resultatKlageDepartement?: ResultatKlage | '' | null;
};

type Bot = {
  id?: number;
  beloepDag?: number | '';
  oekingEtterDager?: number | '';
  oekningType?: BotOekningType | '' | null;
  oekingSats?: number | '';
  vedtakDato?: string | null;
  startDato?: string | null;
  sluttDato?: string | null;
  kommentar?: string | null;
};

export type StyringsdataType = 'kontroll' | 'loeysing';

export type StyringsdataKontroll = {
  id?: number;
  type: StyringsdataType;
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
  type: StyringsdataType;
  loeysingId: number;
  kontrollId: number;
  ansvarleg: string;
  oppretta?: string | null;
  frist?: string | null;
  reaksjon: ReaksjonsType;
  paaleggReaksjon?: ReaksjonsType | null;
  paaleggKlageReaksjon?: ReaksjonsType | null;
  botReaksjon?: ReaksjonsType | null;
  botKlageReaksjon?: ReaksjonsType | null;
  paalegg?: Paalegg | null;
  paaleggKlage?: Klage | null;
  bot?: Bot | null;
  botKlage?: Klage | null;
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
  styringsdata: StyringsdataKontroll | undefined;
};

export type StyringsdataResult = {
  styringsdataKontrollId?: number;
  styringsdataLoeysing: StyringsdataListElement[];
};
