import { Verksemd } from '@verksemder/api/types';

export type Loeysing = {
  id: number;
  namn: string;
  url: string;
  orgnummer: string;
  verksemdId?: number;
};

export type LoeysingInit = {
  namn: string;
  url: string;
  organisasjonsnummer: string;
  verksemd: Verksemd;
};

export type Utval = {
  id: number;
  namn: string;
  oppretta: Date;
  loeysingar: Loeysing[];
};

export type LoeysingFormElement = {
  id: number;
  namn: string;
  url: string;
  orgnummer: string;
  verksemd: Verksemd | undefined;
};
