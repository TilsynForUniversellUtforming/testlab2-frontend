import { Loeysing } from '../../loeysingar/api/types';
import { TestResultat } from '../../tester/api/types';

export type MaalingInit = {
  navn: string;
  loeysingList: Loeysing[];
};

export type MaalingEdit = {
  id: number;
  navn: string;
  loeysingList: Loeysing[];
};

export type MaalingStatus = 'planlegging' | 'crawling' | 'kvalitetssikring';
export type JobStatus = 'ikke_ferdig' | 'feilet' | 'ferdig';

export type CrawlResultat = {
  type: JobStatus;
  loeysing: Loeysing;
  urlList?: string[];
};
export type JobStatistics = {
  numPerforming: number;
  numFinished: number;
  numError: number;
};

export type Maaling = {
  id: number;
  navn: string;
  loeysingList: Loeysing[];
  status: MaalingStatus;
  crawlResultat: CrawlResultat[];
  crawlStatistics: JobStatistics;
  testStatistics: JobStatistics;
  testResultat?: TestResultat[];
};
