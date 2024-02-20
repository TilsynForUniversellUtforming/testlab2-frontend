import { Svar } from '@test/api/types';
import { TestregelSkjema } from '@test/util/testregelParser';

export type SkjemaMedSvar = {
  skjema: TestregelSkjema;
  svar: Svar[];
};
