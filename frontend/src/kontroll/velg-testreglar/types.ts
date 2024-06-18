import { Regelsett, TestregelBase } from '@testreglar/api/types';

import { Kontroll, TestStatus } from '../types';

export type VelgTestreglarLoader = {
  kontroll: Kontroll;
  testregelList: TestregelBase[];
  regelsettList: Regelsett[];
  testStatus: TestStatus;
};

export type SelectionType = 'regelsett' | 'testregel';

export type KontrollTestreglar = {
  regelsettId: number | undefined;
  testregelList: TestregelBase[];
};
