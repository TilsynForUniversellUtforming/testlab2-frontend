import { Loeysing } from '@loeysingar/api/types';
import { TestregelResultat } from '@test/util/testregelParser';
import { InnhaldstypeTesting, Testregel } from '@testreglar/api/types';

import { Sideutval, SideutvalType } from '../kontroll/sideutval/types';
import {
  ResultatManuellKontroll,
  Svar,
  TestgrunnlagListElement,
} from './api/types';
import { StyringsdataListElement } from '../styringsdata/types';
import { KontrollType } from '../kontroll/types';

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

export type TestOverviewLoaderData = {
  loeysingList: Loeysing[];
  resultater: ResultatManuellKontroll[];
  testgrunnlag: Testgrunnlag[];
  styringsdata: StyringsdataListElement[];
  styringsdataError: boolean;
  kontrolltype: KontrollType;
};

export type TestOverviewLoaderResponse = {
  testResultatForLoeysing: ResultatManuellKontroll[];
  sideutvalForLoeysing: Sideutval[];
  testreglarForLoeysing: Testregel[];
  testKeys: string[];
  activeLoeysing: Loeysing;
  kontrollTitle: string;
  sideutvalTypeList: SideutvalType[];
  innhaldstypeList: InnhaldstypeTesting[];
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
  testreglar: Testregel[];
  sideutval: Sideutval[];
  type: 'OPPRINNELIG_TEST' | 'RETEST';
  datoOppretta: string;
};
