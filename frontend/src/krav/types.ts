export type Krav = {
  id: number;
  tittel: string;
  status: string;
  innhald?: string;
  gjeldAutomat: boolean;
  gjeldNettsider: boolean;
  gjeldApp: boolean;
  urlRettleiing?: string;
  prinsipp: string;
  retningslinje: string;
  suksesskriterium: string;
  samsvarsnivaa: Samsvarsnivaa;
};

// export type Krav = {
//   id: number;
//   tittel: string;
//   status: KravStatus;
//   innhald?: string;
//   gjeldAutomat: boolean;
//   gjeldNettsider: boolean;
//   gjeldApp: boolean;
//   urlRettleiing?: string;
//   prinsipp: string;
//   retningslinje: string;
//   suksesskriterium: string;
//   samsvarsnivaa: Samsvarsnivaa;
// };

export type Samsvarsnivaa = 'A' | 'AA' | 'AAA';
export enum KravStatus {
  nytt = 'Nytt',
  gjeldande = 'Gjeldande',
  utgaatt = 'Utgått',
}

export enum WcagPrinsipp {
  mulig_aa_oppfatte = '1. Mulig å oppfatte',
  mulig_aa_betjene = '2. Mulig å betjene',
  forstaelig = '3. Forståelig',
  robust = '4. Robust',
}

export enum WcagRetninglinje {
  tekst_alternativ = '1.1 Tekstalternativer',
  tidsbasert_media = '1.2 Tidsbasert media',
  mulig_aa_tilpasse = '1.3 Mulig å tilpasse',
  mulig_aa_skille_fra_hverandre = '1.4 Mulig å skille fra hverandre',
  tilgjengelig_med_testatur = '2.1 Tilgjengelig med tastatur',
  nok_tid = '2.2 Nok tid',
  anfall = '2.3 Anfall',
  navigerbar = '2.4 Navigerbar',
  inndata_modalitet = '2.5 Inndata modalitet',
  leselig = '3.1 Leselig',
  forutsigbar = '3.2 Forutsigbar',
  inndatahjelp = '3.3 Inndatahjelp',
  kompatibel = '4.1 Kompatibel',
}
