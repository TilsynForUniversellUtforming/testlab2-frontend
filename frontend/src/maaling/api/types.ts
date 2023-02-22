import { Loeysing } from '../../loeysingar/api/types';

export type Aksjon = {
  metode: string;
  data: Map<string, string>;
};

export type MaalingInit = {
  navn: string;
  loeysingList: Loeysing[];
};

export type CreatedMaaling = {
  url?: string;
};

export type Maaling = {
  id: number;
  navn: string;
  status: string;
  aksjoner: Aksjon[];
  loeysingList?: Loeysing[];
};
