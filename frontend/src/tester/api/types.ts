export type ElementOmtale = {
  htmlCode: string;
  pointer: string;
};

export type AzTestResult = {
  side: URL;
  suksesskriterium: string[];
  elementResultat: string;
  testregelId: string;
  elementOmtale: ElementOmtale[];
};
