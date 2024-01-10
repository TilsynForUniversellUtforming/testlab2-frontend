import { Loeysing } from '@loeysingar/api/types';
import { NettsidePropertyType } from '@sak/form/steps/loeysing/inngaaende/loeysing-nettisde/types';
import { LoeysingNettsideRelation } from '@sak/types';
import { Testregel } from '@testreglar/api/types';

export type NySak = {
  virksomhet: string;
};

type NettsideDTO = {
  type: NettsidePropertyType;
  url: string;
  beskrivelse: string;
  begrunnelse: string;
};

type SakLoesyingDTO = {
  loeysingId: number;
  nettsider: NettsideDTO[];
};

export type EditSak = {
  id: number;
  virksomhet: string;
  loeysingar: SakLoesyingDTO[];
  testreglar: Testregel[];
};

export type Sak = {
  id: number;
  verksemd: Loeysing;
  loeysingList: LoeysingNettsideRelation[];
  testreglar: Testregel[];
};

export type SakListeElement = Pick<Sak, 'id' | 'verksemd'>;
