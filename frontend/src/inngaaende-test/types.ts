export type TestingStepInputType =
  | 'jaNei' // Ja nei radio
  | 'radio' // Multi radio
  | 'tekst' // Text input
  | 'instruksjon'; // Kun tekst til brukeren

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

export type TestingStep = {
  heading: string;
  description: string;
  input: TestingStepInput;
};

type KolonneDTO = {
  title: string;
};

export type RuteDTO = {
  type: TestingRouteActionType;
  steg: TargetType;
  fasit: string;
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
  type: TestingStepInputType;
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
  element: string;
  kolonner: KolonneDTO[];
  steg: StegDTO[];
};
