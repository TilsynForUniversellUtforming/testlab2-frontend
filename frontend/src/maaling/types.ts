import { AppContext } from '../common/types';
import { Loeysing } from '../loeysingar/api/types';
import { TestRegelsett } from '../testreglar/api/types';
import { Maaling } from './api/types';

export interface MaalingContext extends AppContext {
  maaling?: Maaling;
  setMaaling: (maaling: Maaling) => void;
  loeysingList: Loeysing[];
  regelsettList: TestRegelsett[];
  showMaalinger: boolean;
  handleStartCrawling: (maaling: Maaling) => void;
  handleStartTest: (maaling: Maaling) => void;
}

export type CrawlUrl = {
  url: string;
};
