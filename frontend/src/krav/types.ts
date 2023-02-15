export type Krav = {
  id: number;
  tittel: string;
  status: string;
  innhald?: string;
  gjeldautomat: boolean;
  gjeldnettsider: boolean;
  gjeldapp: boolean;
  urlrettleiing?: string;
};
