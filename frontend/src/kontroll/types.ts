import { Utval } from '@loeysingar/api/types';

import { KontrollTestreglar } from './velg-testreglar/types';
import { SideutvalLoeysing } from './sideutval/types';

export type Kontroll = {
  id: number;
  kontrolltype: KontrollType;
  tittel: string;
  saksbehandler: string;
  sakstype: Sakstype;
  arkivreferanse: string;
  utval: Utval | undefined;
  testreglar: KontrollTestreglar | undefined;
  sideutval?: SideutvalLoeysing[]
};

export type UpdateKontrollTestregel = {
  kontroll: Kontroll;
  testreglar: UpdateKontrollTestreglar;
  neste: boolean;
};

export type UpdateKontrollTestreglar = {
  regelsettId: number | undefined;
  testregelIdList: number[];
};

export type KontrollType = 'manuell-kontroll';
export type Sakstype = 'forvaltningssak' | 'arkivsak';
