export type Resultat = {
  id: number;
  namn: string;
  type: string;
  testar: string;
  dato: string;
  loeysingar: LoeysingResultat[];
};

export type LoeysingResultat = {
  idLoeysing: number;
  namnLoeysing: string;
  namnVerksemd: string;
  score: number;
  testType: string;
  progress: number;
  testar: string[];
};

export type ResultatOversiktLoeysing = {
  loeysingId: number;
  loeysingNamn: string;
  typeKontroll: string;
  testar: string[];
  score: number;
  krav: string;
  talTestaElement: number;
  talElementBrot: number;
  talElementSamsvar: number;
};
