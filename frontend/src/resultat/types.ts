import { TesterResult } from '@maaling/api/types';

import { KontrollType } from '../kontroll/types';
import { Krav } from '../krav/types';

export type Resultat = {
  id: number;
  namn: string;
  type: KontrollType;
  testType: string;
  testar: string;
  dato: string;
  loeysingar: LoeysingResultat[];
};

export type LoeysingResultat = {
  loeysingId: number;
  loeysingNamn: string;
  verksemdNamn: string;
  score: number;
  testType: string;
  progress: number;
  testar: string[];
};

export type ResultatOversiktLoeysing = {
  loeysingId: number;
  loeysingNamn: string;
  typeKontroll: KontrollType;
  kontrollNamn: string;
  testar: string[];
  score?: number;
  kravId: number;
  talTestaElement: number;
  talElementBrot: number;
  talElementSamsvar: number;
};

export type ResultatTema = {
  temaNamn: string;
  score: number;
  talTestaElement: number;
  talElementBrot: number;
  talElementSamsvar: number;
  talIkkjeTestbar: number;
  talIkkjeForekomst: number;
};

export type ResultatKrav = {
  suksesskriterium: string;
  score: number;
  talTestaElement: number;
  talElementBrot: number;
  talElementSamsvar: number;
  talIkkjeTestbar: number;
  talIkkjeForekomst: number;
};

export type ViolationsData = {
  detaljerResultat: TesterResult[];
  kontrollData: ResultatOversiktLoeysing[];
  krav: Krav;
};
