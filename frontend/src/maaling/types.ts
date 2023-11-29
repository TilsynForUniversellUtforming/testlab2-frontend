import { AppContext, Severity } from '@common/types';
import { Loeysing, Utval } from '@loeysingar/api/types';
import { Verksemd } from '@verksemder/api/types';

import { Regelsett, Testregel } from '../testreglar/api/types';
import { User } from '../user/api/types';
import { Maaling } from './api/types';

export interface MaalingContext extends AppContext {
  refreshMaaling: () => void;
  maalingList: Maaling[];
  setMaalingList: (maalingList: Maaling[]) => void;
  maaling?: Maaling;
  setMaaling: (maaling: Maaling) => void;
  loeysingList: Loeysing[];
  verksemdList: Verksemd[];
  testregelList: Testregel[];
  regelsettList: Regelsett[];
  utvalList: Utval[];
  advisors: User[];
  handleStartCrawling: (maaling: Maaling) => void;
  handleStartTest: (maaling: Maaling) => void;
  handleStartPublish: (maaling: Maaling) => void;
  testStatus: MaalingTestStatus;
  clearTestStatus: () => void;
  pollMaaling: boolean;
  setPollMaaling: (pollMaaling: boolean) => void;
  loadingMaaling: boolean;
}

export type CrawlUrl = {
  url: string;
};

export type MaalingTestStatus = {
  loading: boolean;
  message?: string;
  severity?: Severity;
};
