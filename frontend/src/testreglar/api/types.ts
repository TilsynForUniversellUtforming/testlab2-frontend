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

export type TestregelType = 'forenklet' | 'inngaaende';

export type Testregel = {
  id: number;
  name: string;
  krav: string;
  testregelSchema: string;
  type: TestregelType;
};

export type TestregelCreateRequest = {
  krav: string;
  testregelSchema: string;
  name: string;
  type: TestregelType;
};

export type TestRegelsett = {
  id: number;
  namn: string;
  type: TestregelType;
  testregelList: Testregel[];
};
