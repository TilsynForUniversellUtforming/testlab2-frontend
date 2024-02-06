import { LoeysingNettsideRelation } from '@sak/types';
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
  sakId: number;
  loeysingId: number;
  testregelId: number;
  nettsideId: number;
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
} & CreateTestResultat;

export type ResultatStatus =
  | 'Ferdig'
  | 'Deaktivert'
  | 'UnderArbeid'
  | 'IkkjePaabegynt';

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
    return 'Side';
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

export type Testgrunnlag = {
  id: number;
} & CreateTestgrunnlag;

export type CreateTestgrunnlag = {
  parentId: number;
  namn: string;
  testreglar: number[];
  loeysingNettsideRelation: LoeysingNettsideRelation;
  type: string;
};
