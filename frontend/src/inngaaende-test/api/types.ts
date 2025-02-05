import { finnSvar, TestregelResultat } from '@test/util/testregelParser';
import { Testregel } from '@testreglar/api/types';

export type Svar = {
  steg: string;
  svar: string;
};

export type ElementResultat =
  | 'samsvar'
  | 'ikkjeForekomst'
  | 'brot'
  | 'advarsel'
  | 'ikkjeTesta';

export type CreateTestResultat = {
  testgrunnlagId: number;
  loeysingId: number;
  testregelId: number;
  sideutvalId: number;
  elementOmtale?: string;
  elementResultat?: ElementResultat;
  elementUtfall?: string;
  testVartUtfoert?: string;
  kommentar?: string;
};

export type ResultatManuellKontroll = {
  id: number;
  svar: Svar[];
  status: ResultatStatus;
  sistLagra: string;
} & CreateTestResultat;

export type ResultatStatus =
  | 'Ferdig'
  | 'Deaktivert'
  | 'UnderArbeid'
  | 'IkkjePaabegynt';

export const elementOmtaleSide = 'Side';

export function toElementResultat(
  resultat: TestregelResultat
): ElementResultat {
  if (resultat.type === 'avslutt') {
    switch (resultat.fasit) {
      case 'Ja':
        return 'samsvar';
      case 'Nei':
        return 'brot';
      case 'Ikkje testbart':
        return 'ikkjeTesta';
    }
  } else {
    return 'ikkjeForekomst';
  }
}

export function findElementOmtale(
  testregel: Testregel,
  svar: Svar[]
): string | undefined {
  const element = JSON.parse(testregel.testregelSchema).element;
  if (element.toLowerCase() === 'side') {
    return elementOmtaleSide;
  } else {
    return finnSvar(element, svar);
  }
}

export type Bilde = {
  id: number;
  bildeURI: string;
  thumbnailURI: string;
  opprettet: Date;
};

export type TestgrunnlagListElement = {
  id: number;
  loeysingId: number;
};

export type RetestRequest = {
  originalTestgrunnlagId: number;
  kontrollId: number;
  loeysingId: number;
};
