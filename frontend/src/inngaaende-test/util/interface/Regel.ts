import { DelutfallFasitTyper } from './Delutfall';
import { Handling } from './Handling';

/**
 * Regler for ruting
 */
export type Regel =
  | RegelLik
  | RegelUlik
  | RegelMellom
  | RegelTalDersom
  | RegelVurderDelutfall;

/**  Ein lik regel sjekkar om eit svar frå eit Steg.svar er lik ein gitt verdi (sann) og utfører då ei handling. */
export interface RegelLik {
  /** Type regel */
  type: 'lik';
  /** Referanse til steg-id, der svar skal sjekkast. */
  sjekk: string;
  /** Verdi det skal sjekke mot */
  verdi: string;
  /** Handling som skal utløses av reglen */
  handling: Handling;
}

/** Ein ulik regel går motsett veg av ein lik regel og utfører handlinga dersom den er usann.  */
export interface RegelUlik {
  /** Type regel */
  type: 'ulik';
  /** Referanse til steg-id, der svar skal sjekkast. */
  sjekk: string;
  /** Verdi det skal sjekke mot */
  verdi: string;
  /** Handling som skal utløses av reglen */
  handling: Handling;
}

/** Ein ruting regel som sjekkar om eit Steg.svar er mellom to gitte verdiar. */
export interface RegelMellom {
  /** Type regel */
  type: 'mellom';
  /** Referanse til steg som skal sjekkast  */
  sjekk: string;
  /** Den lågaste verdien det skal sjekkast mot. */
  verdi: number;
  /** Den høgaste verdien det skal sjekkast mot. */
  verdi2: number;
  /** Handling som skal utløses av reglen */
  handling: Handling;
}

/** Tal dersom sjekkar kor mange Steg.svar som samsvarar med ein gitt verdi.  */
export interface RegelTalDersom {
  /** Type regel */
  type: 'talDersom';
  /** Matrise med referansar stegid-ar som som skal sjekkast  */
  sjekk: Array<string>;
  /** Verdi som svar skal vere lik for å teljast med. */
  verdi: number;
  /** Den lågaste verdien av tal svar som skal utløyse regelen. */
  mellom1: number;
  /** Den høgaste verdien av tal svar som ska utløyse regelen. */
  mellom2: number;
  /** Handling som skal utløses av reglen */
  handling: Handling;
}

/** Sjekkar eit delutfall og utfører handling basert på det. */
export interface RegelVurderDelutfall {
  /** Type regel */
  type: 'vurderDelutfall';
  /** Id for delutfall */
  id: number;
  /** Kva verdi delutfall skal matchast opp i mot. (Ja,Nei,Ikkje testbart, Ikkje forekomst)  */
  verdi: DelutfallFasitTyper;
  /** Handling som skal utløses av reglen */
  handling: Handling;
}
