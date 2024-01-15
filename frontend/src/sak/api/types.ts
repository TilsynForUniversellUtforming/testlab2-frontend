import { Loeysing } from '@loeysingar/api/types';
import { LoeysingNettsideRelation } from '@sak/types';
import { Testregel } from '@testreglar/api/types';

export type NySak = {
  namn: string;
  virksomhet: string;
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

export type Sak = {
  id: number;
  namn: string;
  ansvarleg: string;
  verksemd: Loeysing;
  loeysingList: LoeysingNettsideRelation[];
  testreglar: Testregel[];
};

export type SakListeElement = Pick<Sak, 'id' | 'namn' | 'ansvarleg'>;
