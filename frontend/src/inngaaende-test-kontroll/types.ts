import { TestregelResultat } from '@test/util/testregelParser';
import { InnhaldstypeTesting, Testregel } from '@testreglar/api/types';

import { ResultatManuellKontroll, Svar, TestgrunnlagListElement, } from './api/types';
import { Kontroll } from '../kontroll/types';
import { SideutvalType } from '../kontroll/sideutval/types';
import { Loeysing } from '@loeysingar/api/types';

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
  contextKontroll: Kontroll;
  contextLoeysingWithSideutval: Loeysing[];
  testgrunnlag: TestgrunnlagListElement[];
  sideutvalType: SideutvalType[];
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
  kontroll: Kontroll;
  loeysingWithSideutval: Loeysing[];
  testgrunnlag: TestgrunnlagListElement[];
  sideutvalType: SideutvalType[];
  innhaldstypeTestingList: InnhaldstypeTesting[];
};

export type TestOverviewLoaderResponse = {
  results: ResultatManuellKontroll[];
};
