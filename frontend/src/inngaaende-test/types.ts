import { Sak } from '@sak/api/types';

import { ElementResultat, ResultatManuellKontroll, Svar } from './api/types';

export type TestingStepInputDTO =
  | 'jaNei' // Ja nei radio
  | 'radio' // Multi radio
  | 'tekst' // Text input
  | 'instruksjon'; // Kun tekst til brukeren

export type FasitType =
  | 'Ja'
  | 'Nei'
  | 'Ikkje testbart'
  | 'Ikkje forekomst'
  | 'sjekkDelutfall';

export type TestingStepInputType = TestingStepInputDTO | 'multiline';

export type TestingRouteActionType = 'gaaTil' | 'avslutt' | 'ikkjeForekomst';

type GaaTilAction = { action: 'gaaTil' };
type AvsluttAction = { action: 'avslutt' };
type IkkjeForekomstAction = { action: 'ikkjeForekomst' };

export type TargetType = `${number}.${number}`;

type GaaTilOutcome = GaaTilAction & {
  target: TargetType;
};

type AvsluttOutcome = AvsluttAction & {
  fasit: string;
  utfall: string;
};

type IkkjeForekomstOutcome = IkkjeForekomstAction & {
  utfall: string;
};

export type SelectionOutcome = { label: string } & (
  | GaaTilOutcome
  | AvsluttOutcome
  | IkkjeForekomstOutcome
);

type TestingStepInput = {
  inputType: TestingStepInputType;
  inputSelectionOutcome: SelectionOutcome[];
  required: boolean;
};

export type TestingStepProperties = {
  heading: string;
  description: string;
  input: TestingStepInput;
};

export type TestStep = {
  step: TestingStepProperties;
  answer?: Svar;
};

type KolonneDTO = {
  title: string;
};

export type RuteDTO = {
  type: TestingRouteActionType;
  steg: TargetType;
  fasit: FasitType;
  utfall: string;
};

export type JaNeiType = 'ja' | 'nei';

export type RutingDTO = {
  alle: RuteDTO;
  ja: RuteDTO;
  nei: RuteDTO;
  [key: `alt${number}`]: RuteDTO;
};

export type StegDTO = {
  stegnr: string;
  spm: string;
  ht: string;
  type: TestingStepInputDTO;
  multilinje: boolean;
  label: string;
  datalist: string;
  oblig: boolean;
  kilde: string[];
  svarArray: string[];
  ruting: RutingDTO;
};

export type TestregelDTO = {
  namn: string;
  id: string;
  type: string;
  spraak: string;
  kravTilSamsvar: string;
  side: string;
  element: TargetType;
  kolonner: KolonneDTO[];
  steg: StegDTO[];
};

export type ManuellTestStatus =
  | 'ferdig'
  | 'deaktivert'
  | 'under-arbeid'
  | 'ikkje-starta';

export type ButtonStatus = ManuellTestStatus | 'aktiv';

export type TestregelOverviewElement = {
  id: number;
  name: string;
  krav: string;
};

export interface TestContext {
  contextSak: Sak;
  contextTestResults: ResultatManuellKontroll[];
  contextSetTestResults: (testResults: ResultatManuellKontroll[]) => void;
}

export const innhaldsType = [
  'Bilde og grafikk',
  'Captcha',
  'Heile nettsida',
  'Iframe',
  'Innhald med tidsavgrensing',
  'Innhald som blinkar og/eller oppdaterer automatisk',
  'Kjeldekode',
  'Lenke',
  'Liste',
  'Lyd og video',
  'Overskrift',
  'Sidetittel',
  'Skjemaelement',
  'Statusmelding',
  'Tabell',
  'Tastatur',
  'Tekst',
  'Alle',
];

export type InnhaldsType = (typeof innhaldsType)[number];

export type PageType = {
  nettsideId: number;
  pageType: string;
};

export type TestAnswers = {
  answers: Svar[];
  elementOmtale?: string;
  elementResultat?: ElementResultat;
  elementUtfall?: string;
};

export type ManualTestregel = {
  element: TargetType;
  steps: Map<string, TestingStepProperties>;
};
