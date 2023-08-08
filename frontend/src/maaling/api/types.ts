import { Loeysing } from '../../loeysingar/api/types';
import { Testregel } from '../../testreglar/api/types';

export type CrawlParameters = {
  maxLinksPerPage: number;
  numLinksToSelect: number;
};

export type MaalingInit = MaalingInitMedLoeysingList | MaalingInitMedUtval;

export type MaalingInitMedLoeysingList = {
  navn: string;
  loeysingIdList: number[];
  testregelIdList: number[];
  crawlParameters: CrawlParameters;
};

export type MaalingInitMedUtval = {
  navn: string;
  utvalId: number;
  testregelIdList: number[];
  crawlParameters: CrawlParameters;
};

export type MaalingEditParams = {
  id: number;
  navn: string;
  loeysingIdList?: number[];
  testregelIdList?: number[];
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
  antallNettsider: number;
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
  compliancePercent?: number;
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
  datoStart: string;
  loeysingList: Loeysing[];
  testregelList: Testregel[];
  status: MaalingStatus;
  crawlResultat: CrawlResultat[];
  crawlStatistics: JobStatistics;
  testStatistics: JobStatistics;
  testResult: TestResult[];
  crawlParameters?: CrawlParameters;
};

export type IdList = {
  idList: number[];
};

export type RestartProcess = 'crawling' | 'test';

export type RestartRequest = {
  maalingId: number;
  loeysingIdList: IdList;
  process: RestartProcess;
};
