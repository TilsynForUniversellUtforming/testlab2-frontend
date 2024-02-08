import { RutingTriggere } from './RutingTriggere';

/** Steg i Testregel */
export type Steg = StegJaNei | StegRadio | StegTekst | StegInstruksjon;

/**
 * Steg med Ja og Nei som alternativ
 */
export interface StegJaNei {
  /** Type steg */
  type: 'jaNei';
  /** Stegnr */
  stegnr: string;
  /** Spørsmål på steget*/
  spm: string;
  /** Hjelpetekst */
  ht: string;
  /** Ruting  */
  ruting: RutingTriggere;
  /** Liste med kildehenvisninger (feks ["G12"]) */
  kilde?: Array<string>;
  /** url til bilde (For bilde som hjelp) */
  image?: string;
}

/**
 * Steg med egendefinerte radioknapper
 */
export interface StegRadio {
  type: 'radio';
  /** Stegnr */
  stegnr: string;
  /** Spørsmål på steget*/
  spm: string;
  /** Hjelpetekst */
  ht: string;
  /** Ruting  */
  ruting: RutingTriggere;
  /** Label (For felt som trenger label) */
  svarArray: Array<string>;
  /** Liste med kildehenvisninger (feks ["G12"]) */
  kilde?: Array<string>;
  /** url til bilde (For bilde som hjelp) */
  image?: string;
}

export interface StegTekst {
  type: 'tekst';
  /** Stegnr */
  stegnr: string;
  /** Spørsmål på steget*/
  spm: string;
  /** Hjelpetekst */
  ht: string;
  /** Ruting  */
  ruting: RutingTriggere;
  /** Label (For felt som trenger label) */
  label?: string;
  /** Liste med kildehenvisninger (feks ["G12"]) */
  kilde?: Array<string>;
  /** url til bilde (For bilde som hjelp) */
  image?: string;
  /** Multilinje (For steg av typen tekst som krever lengre innput) */
  multilinje?: boolean;
  /** Filter for tekstinput */
  filter?: string;
  /** For å koble tekstfelt til en dataliste */
  datalist?: DataListeTyper;
}

export interface StegInstruksjon {
  type: 'instruksjon';
  /** Stegnr */
  stegnr: string;
  /** Spørsmål på steget*/
  spm: string;
  /** Hjelpetekst */
  ht: string;
  /** Ruting  */
  ruting: RutingTriggere;
  /** Liste med kildehenvisninger (feks ["G12"]) */
  kilde?: Array<string>;
  /** url til bilde (For bilde som hjelp) */
  image?: string;
}

export type DataListeTyper = 'Sideutvalg';
export type FilterTyper = 'tal';
