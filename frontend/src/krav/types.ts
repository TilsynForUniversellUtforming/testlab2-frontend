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

export type Samsvarsnivaa = 'A' | 'AA' | 'AAA';
