import { Loeysing } from '../../loeysingar/api/types';

export type Aksjon = {
  metode: string;
  data: Map<string, string>;
};

export type MaalingInit = {
  navn: string;
  loeysingList: Loeysing[];
};

export type CreatedMaaling = {
  url?: string;
};

export type CrawlStatus = 'ikke_ferdig' | 'feilet';

export type CrawlResultat = {
  status: CrawlStatus;
  loeysing: Loeysing;
};

export type MaalingStatus = 'planlegging' | 'crawling';

export type Maaling = {
  id: number;
  navn: string;
  status: MaalingStatus;
  aksjoner: Aksjon[];
  loeysingList?: Loeysing[];
  crawlResultat?: CrawlResultat[];
};
