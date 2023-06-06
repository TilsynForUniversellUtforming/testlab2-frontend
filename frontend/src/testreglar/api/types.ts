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
  krav: string;
  referanseAct: string;
  kravTilSamsvar: string;
};

export type TestregelCreateRequest = {
  krav: string;
  referanseAct: string;
  kravTilSamsvar: string;
};

export type TestRegelsett = {
  id: number;
  namn: string;
  testregelList: Testregel[];
};
