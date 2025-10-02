import { Verksemd } from '@verksemder/api/types';

export type Loeysing = {
  id: number;
  namn: string;
  url: string;
  orgnummer: string;
  verksemdId?: number;
  type: 'nett' | 'app';
  verksemdnamn: string;
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

export type LoeysingVerksemd = {
  id: number;
  namn: string;
  url: string;
  orgnummer: string;
  type: 'nett' | 'app';
  verksemdNamn: string;
};
