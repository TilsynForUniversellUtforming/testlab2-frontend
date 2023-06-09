import { Loeysing } from '../../loeysingar/api/types';

export type CrawlParameters = {
  maxLinksPerPage: number;
  numLinksToSelect: number;
};

export type MaalingInit = {
  navn: string;
  loeysingIdList: number[];
  crawlParameters: CrawlParameters;
};

export type MaalingEdit = {
  id: number;
  navn: string;
  loeysingIdList?: number[];
  crawlParameters?: CrawlParameters;
};

export type MaalingStatus =
  | 'planlegging'
  | 'crawling'
  | 'kvalitetssikring'
  | 'testing'
  | 'testing_ferdig';

export type CrawlJobStatus =
  | 'ikkje_starta'
  | 'ikke_ferdig'
  | 'feilet'
  | 'ferdig';

export type TestJobStatus = 'ikkje_starta' | 'starta' | 'feila' | 'ferdig';

export type Framgang = {
  prosessert: number;
  maxLenker: number;
};

export type CrawlResultat = {
  type: CrawlJobStatus;
  framgang?: Framgang;
  loeysing: Loeysing;
  urlList?: string[];
};
export type JobStatistics = {
  numPerforming: number;
  numFinished: number;
  numError: number;
};

export type AggregatedTestresult = {
  testregelId: string;
  suksesskriterium: string;
  fleireSuksesskriterium: string[];
  talElementSamsvar: number;
  talElementBrot: number;
  talElementVarsel: number;
  talSiderSamsvar: number;
  talSiderBrot: number;
  talSiderIkkjeForekomst: number;
};

export type TestResult = {
  loeysing: Loeysing;
  tilstand: TestJobStatus;
  sistOppdatert: string;
  framgang?: Framgang;
  aggregatedResultList: AggregatedTestresult[];
  compliancePercent?: number;
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
  crawlParameters: CrawlParameters;
};

export type IdList = {
  idList: number[];
};

export type RestartCrawlRequest = {
  maalingId: number;
  loeysingIdList: IdList;
};
