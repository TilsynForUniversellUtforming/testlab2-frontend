import { TestlabLocale } from '@common/types';

import { Krav } from '../../krav/types';

export type TestregelModus = 'automatisk' | 'manuell' | 'semi-automatisk';

export type TestregelBase = {
  id: number;
  namn: string;
  krav: Krav;
  modus: TestregelModus;
};

export type TestregelStatus =
  | 'ikkje_starta'
  | 'under_arbeid'
  | 'gjennomgaatt_workshop'
  | 'klar_for_testing'
  | 'treng_avklaring'
  | 'ferdig_testa'
  | 'klar_for_kvalitetssikring'
  | 'publisert'
  | 'utgaar';

export type Tema = {
  id: number;
  tema: string;
};

export type Testobjekt = {
  id: number;
  testobjekt: string;
};

export type InnhaldstypeTesting = {
  id?: number;
  innhaldstype: string;
};

export type TestregelInnholdstype = 'app' | 'automat' | 'dokument' | 'nett';

export type Testregel = TestregelBase & {
  testregelId: string;
  versjon: number;
  status: TestregelStatus;
  datoSistEndra: string;
  type: TestregelInnholdstype;
  spraak: TestlabLocale;
  tema?: Tema;
  testobjekt?: Testobjekt;
  kravTilSamsvar?: string;
  testregelSchema: string;
  innhaldstypeTesting?: InnhaldstypeTesting;
};

export type TestregelInit = TestregelBase & {
  kravId: number;
  testregelId: string;
  versjon: number;
  status: TestregelStatus;
  datoSistEndra: string;
  type: TestregelInnholdstype;
  spraak: TestlabLocale;
  tema?: number;
  testobjekt?: number;
  kravTilSamsvar?: string;
  testregelSchema: string;
  innhaldstypeTesting?: number;
};

export type Regelsett = {
  id: number;
  namn: string;
  modus: TestregelModus;
  standard: boolean;
  testregelList: TestregelBase[];
};

export type RegelsettCreate = {
  namn: string;
  modus: TestregelModus;
  standard: boolean;
  testregelIdList: number[];
};

export type RegelsettEdit = {
  id: number;
  namn: string;
  modus: TestregelModus;
  standard: boolean;
  testregelIdList: number[];
};
