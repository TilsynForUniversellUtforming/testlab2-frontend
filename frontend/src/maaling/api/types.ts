import { Loeysing } from '../../loeysingar/api/types';

export type CrawlParameters = {
  maxLinksPerPage: number;
  numLinksToSelect: number;
};

export type MaalingInit = {
  navn: string;
  loeysingList: Loeysing[];
  crawlParameters: CrawlParameters;
};

export type MaalingEdit = {
  id: number;
  navn: string;
  loeysingList: Loeysing[];
};

export type MaalingStatus =
  | 'planlegging'
  | 'crawling'
  | 'kvalitetssikring'
  | 'testing';

export type CrawlJobStatus = 'ikke_ferdig' | 'feilet' | 'ferdig';

export type TestJobStatus = 'ikkje_starta' | 'starta' | 'feila' | 'ferdig';

export type CrawlResultat = {
  type: CrawlJobStatus;
  loeysing: Loeysing;
  urlList?: string[];
};
export type JobStatistics = {
  numPerforming: number;
  numFinished: number;
  numError: number;
};

export type TestResult = {
  tilstand: TestJobStatus;
  loeysing: Loeysing;
  sistOppdatert: string;
  statusURL: string;
};

export type Maaling = {
  id: number;
  navn: string;
  loeysingList: Loeysing[];
  status: MaalingStatus;
  crawlResultat: CrawlResultat[];
  crawlStatistics: JobStatistics;
  testStatistics: JobStatistics;
  testResult: TestResult[];
};
