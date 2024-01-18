export type Svar = {
  steg: string;
  svar: string;
};

export type ManualElementResultat =
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
  elementResultat?: ManualElementResultat;
  elementUtfall?: string;
  testVartUtfoert?: string;
  ikkjeRelevant: boolean;
};

export type ManualTestResultat = {
  id: number;
  svar: Svar[];
} & CreateTestResultat;
