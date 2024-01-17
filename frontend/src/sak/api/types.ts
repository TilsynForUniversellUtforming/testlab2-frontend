import { Loeysing } from '@loeysingar/api/types';
import { LoeysingNettsideRelation } from '@sak/types';
import { Testregel } from '@testreglar/api/types';

export type NySak = {
  namn: string;
  virksomhet: string;
  frist: string;
};

type NettsideDTO = {
  type: string;
  url: string;
  beskrivelse: string;
  begrunnelse: string;
};

type SakLoeysingDTO = {
  loeysingId: number;
  nettsider: NettsideDTO[];
};

export type EditSak = {
  id: number;
  namn: string;
  virksomhet: string;
  loeysingar: SakLoeysingDTO[];
  testreglar: Testregel[];
};

export type Brukar = {
  brukarnamn: string;
  namn: string;
};

export type Sak = {
  id: number;
  namn: string;
  ansvarleg: Brukar | null;
  verksemd: Loeysing;
  loeysingList: LoeysingNettsideRelation[];
  testreglar: Testregel[];
};

export type SakListeElement = Pick<Sak, 'id' | 'namn' | 'ansvarleg'>;
