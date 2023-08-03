import { AppContext, Severity } from '@common/types';
import { Verksemd } from '@verksemder/api/types';

import { Loeysing, Utval } from '../loeysingar/api/types';
import { TestRegelsett } from '../testreglar/api/types';
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
  regelsettList: TestRegelsett[];
  utvalList: Utval[];
  advisors: User[];
  showMaalinger: boolean;
  handleStartCrawling: (maaling: Maaling) => void;
  handleStartTest: (maaling: Maaling) => void;
  handleStartPublish: (maaling: Maaling) => void;
  testStatus: MaalingTestStatus;
  clearTestStatus: () => void;
  pollMaaling: boolean;
  setPollMaaling: (pollMaaling: boolean) => void;
}

export type CrawlUrl = {
  url: string;
};

export type MaalingTestStatus = {
  loading: boolean;
  message?: string;
  severity?: Severity;
};
