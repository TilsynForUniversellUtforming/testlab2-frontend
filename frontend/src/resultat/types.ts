export type Resultat = {
  id: number;
  namn: string;
  type: string;
  testar: string;
  dato: string;
  loeysingar: LoeysingResultat[];
};

export type LoeysingResultat = {
  id: number;
  namnLoeysing: string;
  score: number;
  testType: string;
  progress: number;
};

export type ResultatListElement = {
  id: number;
  namnLoeysing: string;
  score: number;
  testType: string;
  resultatId: number;
  namnKontroll: string;
  kontrollType: string;
  dato: string;
  talElementSamsvar: number;
  talElementBrot: number;
  testar: string;
};
