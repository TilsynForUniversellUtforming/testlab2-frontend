import { Verksemd } from '@verksemder/api/types';

import { Kontroll } from '../types';

export type Styringsdata = {
  navn: string;
}

export type VerksemdLoeysing = {
  namn: string;
  loeysingCount: number;
  styringsdata?: Styringsdata;
};

export type OppsummeringLoadingType = {
  kontroll: Kontroll;
  verksemdList: Verksemd[];
};
