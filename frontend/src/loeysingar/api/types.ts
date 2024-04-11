export type Loeysing = {
  id: number;
  namn: string;
  url: string;
  orgnummer: string;
  verksemdId: number | undefined;
};

export type LoeysingInit = {
  namn: string;
  url: string;
  organisasjonsnummer: string;
  verksemdId: number | undefined;
};

export type Utval = {
  id: number;
  namn: string;
  oppretta: Date;
  loeysingar: Loeysing[];
};
