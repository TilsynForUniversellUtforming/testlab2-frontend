import { Regelsett, TestregelBase } from '@testreglar/api/types';

import { Kontroll } from '../types';

export type VelgTestreglarLoader = {
  kontroll: Kontroll;
  testregelList: TestregelBase[];
  regelsettList: Regelsett[];
};

export type SelectionType = 'regelsett' | 'testregel';

export type SideutvalType = 'automatisk' | 'manuell';

export type ModusFilter = SideutvalType | 'begge';

export type KontrollTestreglar = {
  regelsettId: number | undefined;
  testregelList: TestregelBase[];
};
