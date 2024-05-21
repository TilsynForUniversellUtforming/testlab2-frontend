import { Loeysing } from '@loeysingar/api/types';
import { TestregelResultat } from '@test/util/testregelParser';
import { InnhaldstypeTesting, Testregel } from '@testreglar/api/types';

import { SideutvalType } from '../kontroll/sideutval/types';
import { Kontroll } from '../kontroll/types';
import { ResultatManuellKontroll, Svar, TestgrunnlagListElement, } from './api/types';

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
  kommentar?: string;
};

export type TestOverviewLoaderResponse = {
  results: ResultatManuellKontroll[];
};

/* Kontroll */
export interface TestContextKontroll {
  contextKontroll: ContextKontroll;
  testgrunnlag: TestgrunnlagListElement[];
  sideutvalTypeList: SideutvalType[];
  innhaldstypeList: InnhaldstypeTesting[];
}

export type InngaaendeTestLoadingResponseKontroll = {
  kontroll: ContextKontroll;
  testgrunnlag: TestgrunnlagListElement[];
  sideutvalTypeList: SideutvalType[];
  innhaldstypeTestingList: InnhaldstypeTesting[];
};

export type ContextKontroll = Kontroll & {
  loeysingList: Loeysing[];
  testregelList: Testregel[];
};
