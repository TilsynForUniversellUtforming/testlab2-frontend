import { Verksemd } from '@verksemder/api/types';

import { Kontroll } from '../types';

export type VerksemdLoeysing = {
  namn: string;
  loeysingCount: number;
};

export type OppsummeringLoadingType = {
  kontroll: Kontroll;
  verksemdList: Verksemd[];
};
