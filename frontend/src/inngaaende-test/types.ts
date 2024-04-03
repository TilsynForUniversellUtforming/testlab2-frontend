import { Sak } from '@sak/api/types';
import { TestregelResultat } from '@test/util/testregelParser';
import { InnhaldstypeTesting, Testregel } from '@testreglar/api/types';

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

export interface TestContext {
  contextSak: Sak;
  testgrunnlag: TestgrunnlagListElement[];
  innhaldstypeList: InnhaldstypeTesting[];
}

export type PageType = {
  nettsideId: number;
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
  kommentar?: string;
};

export type InngaaendeTestLoadingResponse = {
  sak: Sak;
  testgrunnlag: TestgrunnlagListElement[];
  innhaldstypeTestingList: InnhaldstypeTesting[];
};

export type TestOverviewLoaderResponse = {
  results: ResultatManuellKontroll[];
};
