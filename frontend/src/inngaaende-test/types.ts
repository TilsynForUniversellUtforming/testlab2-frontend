export type TestingStepInputType =
  | 'jaNei' // Ja nei radio
  | 'radio' // Multi radio
  | 'tekst' // Text input
  | 'instruksjon'; // Kun tekst til brukeren

type GaaTilAction = { action: 'gaaTil' };
type AvsluttAction = { action: 'avslutt' };
type IkkjeForekomstAction = { action: 'ikkjeForekomst' };

type GaaTilOutcome = GaaTilAction & {
  target: `${number}.${number}`;
};

type AvsluttOutcome = AvsluttAction & {
  fasit: string;
  utfall: string;
};

type IkkjeForekomstOutcome = IkkjeForekomstAction & {
  utfall: string;
};

export type SelectionOutcome =
  | GaaTilOutcome
  | AvsluttOutcome
  | IkkjeForekomstOutcome;

type TestingStepInput = {
  valueLabelList: string[];
  required: boolean;
};

export type TestingStep = {
  heading: string;
  description: string;
  input: TestingStepInput;
  selectionOutcome: SelectionOutcome[]; // Sjekk selectionOutcome mot det som er valgt i input
};
