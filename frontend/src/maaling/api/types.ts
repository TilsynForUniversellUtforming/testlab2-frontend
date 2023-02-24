import { Loeysing } from '../../loeysingar/api/types';

export type MaalingInit = {
  navn: string;
  loeysingList: Loeysing[];
};

export type CreatedMaaling = {
  url?: string;
};

export type CrawlStatus = 'ikke_ferdig' | 'feilet';

export type CrawlResultat = {
  type: CrawlStatus;
  loeysing: Loeysing;
};

export type MaalingStatus = 'planlegging' | 'crawling';

export type Maaling = {
  id: number;
  navn: string;
  loeysingList: Loeysing[];
  status: MaalingStatus;
  crawlResultat?: CrawlResultat[];
};
