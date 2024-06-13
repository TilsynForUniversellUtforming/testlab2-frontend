import { Kontroll } from '../types';

export type VerksemdLoeysing = {
  namn: string;
  loeysingCount: number;
};

export type OppsummeringLoadingType = {
  kontroll: Kontroll;
  verksemdLoesyingList: VerksemdLoeysing[];
};
