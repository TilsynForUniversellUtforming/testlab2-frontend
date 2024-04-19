export type Loeysing = {
  id: number;
  namn: string;
  url: string;
  orgnummer: string;
};

export type LoeysingInit = {
  namn: string;
  url: string;
  organisasjonsnummer: string;
};

export type Utval = {
  id: number;
  namn: string;
  oppretta: Date;
  loeysingar: Loeysing[];
};

export type UtvalFull = {
  id: number;
  namn: string;
  oppretta: Date;
  loeysingar: Loeysing[];
};
