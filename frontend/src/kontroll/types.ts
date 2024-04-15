import { KontrollTestreglar } from './velg-testreglar/types';

export type Kontroll = {
  id: number;
  kontrolltype: KontrollType;
  tittel: string;
  saksbehandler: string;
  sakstype: Sakstype;
  arkivreferanse: string;
};

export type UpdateKontrollTestregel = {
  kontroll: Kontroll;
  testreglar: KontrollTestreglar;
};

export type KontrollType = 'manuell-kontroll';
export type Sakstype = 'forvaltningssak' | 'arkivsak';
