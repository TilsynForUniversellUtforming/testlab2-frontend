export type ACTElement = {
  htmlCode: string;
  pointer: string;
};

export type TestResultat = {
  suksesskriterium: string[];
  side: string;
  testregelId: string;
  sideNivaa: number;
  testVartUtfoert: Date;
  elementUtfall: string;
  elementResultat: string;
  elementOmtale: ACTElement;
};
