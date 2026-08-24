import { Loeysing } from '@loeysingar/api/types';
import { TestregelResultat } from '@test/util/testregelParser';
import { InnhaldstypeTesting, Testregel } from '@testreglar/api/types';

import { Sideutval, SideutvalType } from '../kontroll/sideutval/types';
import {
  ResultatManuellKontroll,
  Svar,
  TestgrunnlagListElement,
} from './api/types';

export type ManuellTestStatus =
  | 'ferdig'
  | 'deaktivert'
  | 'under-arbeid'
  | 'ikkje-starta';

export type ButtonStatus = ManuellTestStatus | 'aktiv';

export type TestregelOverviewElement = {
  id: number;
  name: string;
  krav: string;
};

export type PageType = {
  sideId: number;
  pageType: string;
  url: string;
};

export type ActiveTest = {
  testregel: Testregel;
  testResultList: ResultatManuellKontroll[];
};

export type TestResultUpdate = {
  resultatId: number;
  alleSvar: Svar[];
  resultat?: TestregelResultat;
  elementOmtale?: string;
  elementOmtaleHtml?: string;
  kommentar?: string;
};

export type TestOverviewLoaderData = {
  testgrunnlag: Testgrunnlag[];
  styringsdataError: boolean;
  testoverviewElements: TestOverviewElement[];
  testgrunnlagOverviewElements: TestgrunnlagOverviewElement[];
};

export type TestOverviewLoaderResponse = {
  testResultatForLoeysing: ResultatManuellKontroll[];
  sideutvalForLoeysing: Sideutval[];
  testreglarForLoeysing: Testregel[];
  testKeys: string[];
  activeLoeysing: Loeysing;
  kontrollTitle: string;
};

/* Kontroll */
export interface TestContextKontroll {
  testgrunnlag: TestgrunnlagListElement[];
  sideutvalTypeList: SideutvalType[];
  innhaldstypeList: InnhaldstypeTesting[];
}

export type InngaaendeTestLoadingResponseKontroll = {
  sideutvalTypeList: SideutvalType[];
  innhaldstypeTestingList: InnhaldstypeTesting[];
};

export type Testgrunnlag = {
  id: number;
  kontrollId: number;
  namn: string;
  testreglar: number[];
  sideutval: Sideutval[];
  type: 'OPPRINNELIG_TEST' | 'RETEST';
  datoOppretta: string;
};

export type TestOverviewElement = {
  etTestgrunnlag: Testgrunnlag;
  loeysingNamn: string;
  loeysingId: number;
  testStatus: ManuellTestStatus;
  testType: string;
  styringsdataId: number;
  styringsdataStatus: string;
  testresultat: ResultatManuellKontroll[];
}

export type TestStatusCount = {
  loeysingId: number;
  testgrunnlagId: number;
  total: number;
  ferdig: number;
  underArbeid: number;
  ikkjeStarta: number;
  percentagePerSide: number;
  percentagePerInnholdstype: number;
}

export type TestgrunnlagOverviewElement = {
  loeysingId: number;
  testgrunnlagId: number;
  loeysingNamn: string;
  loeysingstype: string;
  kontrollType: string;
  testgrunnlagType: string;
  styringsdataId?: number;
  styringsdataStatus: string;
  status: ManuellTestStatus;
  kanSlette: boolean;
  kanReteste: boolean;
  teststatistics: TestStatusCount;
};

