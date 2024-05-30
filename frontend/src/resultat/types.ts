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
  namnVerksemd: string;
  score: number;
  testType: string;
  progress: number;
  testar: string[];
};
