import { Steg } from './Steg';

/**
 * Testregel
 */
export interface Testregel {
  /**  Namn på testreglen */
  namn: string;
  /** Id på testreglen */
  id: string;
  /** TestlabId */
  testlabId: number;
  /** Versjon */
  versjon: string;
  /** Type */
  type: string;
  /** Språk */
  spraak: string;
  /** Krav til samsvar */
  kravTilSamsvar: string;
  /** Stegreferanse til element med side */
  side: string;
  /** Stegreferanse til element med side */
  element: string;
  /** Samling med Steg */
  steg: Array<Steg>;
}
