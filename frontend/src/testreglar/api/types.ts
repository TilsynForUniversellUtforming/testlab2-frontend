export type Testregel = {
  id: number;
  kravId: number;
  referanseAct: string;
  kravTilSamsvar: string;
  type: string;
  status: string;
  kravTittel: string;
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
