export type Testregel = {
  Id: number;
  TestregelId: string;
  Navn: string;
  Status: string;
  Dato_endra: string;
  Type: string;
  Krav: string;
  Blinde: boolean;
  Svaksynte: boolean;
  Fargeblinde: boolean;
  Doovblinde: boolean;
  Doove: boolean;
  Tunghooyrde: boolean;
  NedsattKognisjon: boolean;
  NedsattMotorikk: boolean;
  Anfall: boolean;
  Alle: boolean;
  subRows?: [Testregel];
};

export type TestRegelsett = {
  namn: string;
  testreglar: Testregel[];
};

export type RegelsettRequest = {
  namn: string;
  ids: number[];
};
