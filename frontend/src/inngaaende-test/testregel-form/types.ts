import { Svar } from '@test/api/types';
import { TestregelSkjema } from '@test/util/testregelParser';

export type TestFormStep = {
  key: string;
  utfall?: string;
  fasit?: string;
};

export type SkjemaOgSvar = {
  skjemaModell: TestregelSkjema;
  alleSvar: Svar[];
};
