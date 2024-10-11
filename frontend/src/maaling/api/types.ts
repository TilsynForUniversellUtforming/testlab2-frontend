import { Loeysing } from '@loeysingar/api/types';
import { Bilde } from '@test/api/types';
import { TestregelBase } from '@testreglar/api/types';

export type CrawlParameters = {
  maxLenker: number;
  talLenker: number;
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

export type JobStatus = 'ikkje_starta' | 'starta' | 'feila' | 'ferdig';

export type Framgang = {
  prosessert: number;
  maxLenker: number;
};

export type CrawlResultat = {
  type: JobStatus;
  framgang?: Framgang;
  loeysing: Loeysing;
  antallNettsider: number;
};
export type JobStatistics = {
  numPending: number;
  numRunning: number;
  numFinished: number;
  numError: number;
};

export type AggregatedTestresult = {
  loeysing: Loeysing;
  testregelId: string;
  suksesskriterium: string;
  talElementSamsvar: number;
  talElementBrot: number;
  talElementVarsel: number;
  talElementIkkjeForekomst: number;
  compliancePercent?: number;
};

export type TestResult = {
  loeysing: Loeysing;
  tilstand: JobStatus;
  sistOppdatert: string;
  framgang?: Framgang;
  antalSider: number;
  aggregatedResultList: AggregatedTestresult[];
  compliancePercent?: number;
};

export type Maaling = {
  id: number;
  navn: string;
  datoStart: string;
  loeysingList: Loeysing[];
  testregelList: TestregelBase[];
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

export type ElementOmtale = {
  htmlCode?: string;
  pointer?: string;
  description?: string;
};

export type TesterResult = {
  suksesskriterium: string[];
  side: string;
  testregelId: number;
  testregelNoekkel: string;
  sideNivaa: number;
  testVartUtfoert: Date;
  elementUtfall: string;
  elementResultat: string;
  elementOmtale?: ElementOmtale;
  kommentar?: string;
  bilder: Bilde[];
};
