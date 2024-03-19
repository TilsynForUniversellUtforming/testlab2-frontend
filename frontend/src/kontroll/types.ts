export type Kontroll = {
  id: number;
  kontrolltype: KontrollType;
  tittel: string;
  saksbehandler: string;
  sakstype: Sakstype;
  arkivreferanse: string;
};

export type KontrollType = 'manuell-kontroll';
export type Sakstype = 'forvaltningssak' | 'arkivsak';
