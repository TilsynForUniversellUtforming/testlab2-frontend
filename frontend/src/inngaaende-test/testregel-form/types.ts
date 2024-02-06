import { AlleSvar, SkjemaModell } from '@test/util/testregelParser';

export type TestFormStep = {
  key: string;
  utfall?: string;
  fasit?: string;
};

export type SkjemaOgSvar = {
  skjemaModell: SkjemaModell;
  alleSvar: AlleSvar;
};
