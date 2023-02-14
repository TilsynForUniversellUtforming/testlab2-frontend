export enum TestType {
  Web = 'Web',
  App = 'App',
  Automat = 'Automat',
}

export enum TestStatus {
  'Publisert' = 'Publisert',
  'Ferdig testa' = 'Ferdig testa',
  'Treng avklaring' = 'Treng avklaring',
  'Utgår' = 'Utgår',
  'Klar for testing' = 'Klar for testing',
  'Ikkje starta' = 'Ikkje starta',
  'Under arbeid' = 'Under arbeid',
  'Klar for kvalitetssikring' = 'Klar for kvalitetssikring',
  'Gjennomgått workshop' = 'Gjennomgått workshop',
}

export type Testregel = {
  id: number;
  kravId?: number;
  referanseAct?: string;
  kravTilSamsvar: string;
  type: TestType;
  status: TestStatus;
  kravTittel: string;
};

export type TestregelCreateRequest = {
  kravId?: number;
  referanseAct?: string;
  kravTilSamsvar: string;
  type: TestType;
  status?: TestStatus;
};

export type TestregelEditRequest = {
  id: number;
  kravId?: number;
  referanseAct?: string;
  kravTilSamsvar: string;
  type: TestType;
  status?: TestStatus;
};

export type TestRegelsett = {
  id: number;
  namn: string;
  testregelList: Testregel[];
};

export type RegelsettRequest = {
  namn: string;
  ids: number[];
};
