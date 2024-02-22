import { Svar } from '@test/api/types';
import { TestregelSkjema } from '@test/util/testregelParser';

export type SkjemaMedSvar = {
  resultatId: number;
  skjema: TestregelSkjema;
  svar: Svar[];
};
