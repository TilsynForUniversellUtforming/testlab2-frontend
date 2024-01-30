export type Svar = {
  steg: string;
  svar: string;
};

export function svarAsMap(svarArray: Svar[]): Map<string, string> {
  const svarMap = new Map<string, string>();
  svarArray.forEach((svar) => {
    svarMap.set(svar.steg, svar.svar);
  });
  return svarMap;
}

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
};

export type ResultatManuellKontroll = {
  id: number;
  svar: Svar[];
  ferdig: boolean;
} & CreateTestResultat;
