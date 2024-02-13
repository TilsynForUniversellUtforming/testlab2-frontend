import { Handling } from './Handling';

/**
 * Ruting-triggere i et steg
 */
export interface RutingTriggere {
  // Ja
  ja?: Handling;
  // Nei
  nei?: Handling;
  // Alle
  alle?: Handling;
  // For radioknapper egendefinert
  alt0?: Handling;
  alt1?: Handling;
  alt2?: Handling;
  alt3?: Handling;
  alt4?: Handling;
  alt5?: Handling;
  alt6?: Handling;
  alt7?: Handling;
  alt8?: Handling;
  alt9?: Handling;
  alt10?: Handling;
}
