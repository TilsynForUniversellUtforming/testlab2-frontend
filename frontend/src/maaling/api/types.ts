import { Loeysing } from '../../loeysingar/api/types';
import { TestResultat } from '../../tester/api/types';

export type MaalingInit = {
  navn: string;
  loeysingList: Loeysing[];
};

export type CrawlStatus = 'ikke_ferdig' | 'feilet' | 'ferdig';

export type CrawlResultat = {
  type: CrawlStatus;
  loeysing: Loeysing;
  urlList?: string[];
};

export type MaalingStatus = 'planlegging' | 'crawling' | 'kvalitetssikring';

export type Maaling = {
  id: number;
  navn: string;
  loeysingList: Loeysing[];
  status: MaalingStatus;
  crawlResultat: CrawlResultat[];
  numCrawlPerforming: number;
  numCrawlFinished: number;
  numCrawlError: number;
  testResultat?: TestResultat[];
};
