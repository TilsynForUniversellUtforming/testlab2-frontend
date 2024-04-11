import { Utval } from '@loeysingar/api/types';

export type Kontroll = {
  id: number;
  kontrolltype: KontrollType;
  tittel: string;
  saksbehandler: string;
  sakstype: Sakstype;
  arkivreferanse: string;
  utval: Utval;
};

export type KontrollType = 'manuell-kontroll';
export type Sakstype = 'forvaltningssak' | 'arkivsak';
