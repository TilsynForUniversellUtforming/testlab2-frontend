import { AppContext, Severity } from '../common/types';
import { Loeysing } from '../loeysingar/api/types';
import { TestRegelsett } from '../testreglar/api/types';
import { User } from '../user/api/types';
import { Verksemd } from '../verksemder/api/types';
import { Maaling } from './api/types';

export interface MaalingContext extends AppContext {
  maaling?: Maaling;
  setMaaling: (maaling: Maaling) => void;
  loeysingList: Loeysing[];
  verksemdList: Verksemd[];
  regelsettList: TestRegelsett[];
  advisors: User[];
  showMaalinger: boolean;
  handleStartCrawling: (maaling: Maaling) => void;
  handleStartTest: (maaling: Maaling) => void;
  handleStartPublish: (maaling: Maaling) => void;
  testStatus: MaalingTestStatus;
  resetTestStatus: () => void;
}

export type CrawlUrl = {
  url: string;
};

export type MaalingTestStatus = {
  loading: boolean;
  message?: string;
  severity?: Severity;
};
