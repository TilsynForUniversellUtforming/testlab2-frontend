import { Utval } from '@loeysingar/api/types';

import { Sideutval, SideutvalBase } from './sideutval/types';
import { KontrollTestreglar } from './velg-testreglar/types';

export type KontrollListItem = {
  id: number;
  tittel: string;
  saksbehandler: string;
  sakstype: Sakstype;
  arkivreferanse: string;
  kontrolltype: KontrollType;
};

export type Kontroll = {
  id: number;
  kontrolltype: KontrollType;
  tittel: string;
  saksbehandler: string;
  sakstype: Sakstype;
  arkivreferanse: string;
  utval: Utval | undefined;
  testreglar: KontrollTestreglar | undefined;
  sideutvalList: Sideutval[];
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

export type UpdateKontrollSideutval = {
  kontroll: Kontroll;
  sideutvalList: SideutvalBase[];
  neste: boolean;
};

export type KontrollType = 'inngaaende-kontroll';
export type Sakstype = 'forvaltningssak' | 'arkivsak';
