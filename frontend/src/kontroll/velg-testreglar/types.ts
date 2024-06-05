import { Regelsett, TestregelBase } from '@testreglar/api/types';

import { Kontroll } from '../types';

export type VelgTestreglarLoader = {
  kontroll: Kontroll;
  testregelList: TestregelBase[];
  regelsettList: Regelsett[];
};

export type SelectionType = 'regelsett' | 'testregel';

export type KontrollTestreglar = {
  regelsettId: number | undefined;
  testregelList: TestregelBase[];
};
