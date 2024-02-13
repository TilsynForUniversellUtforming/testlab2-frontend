/**
 * Delutfall i en testregel
 */
export interface Delutfall {
  /** Nummer på delutfall (unik) */
  nr: number;
  /** Delutfall i tekst */
  tekst: string;
  /** Fasit på delutfall */
  fasit: DelutfallFasitTyper;
}

export type DelutfallFasitTyper =
  | 'Ja'
  | 'Nei'
  | 'Ikkje testbart'
  | 'Ikkje forekomst';
