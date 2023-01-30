export type TestElement = {
  htmlCode: string;
  pointer: string;
  accessibleName: string;
};

export type TestResult = {
  _idSuksesskriterium: string;
  _idTestregel: string;
  _sideUtfall: string;
  _side: string;
  _idLoeysing: string;
  _idMaaling: number;
  _elementUtfall: number;
  _element: TestElement;
  _brot: boolean;
  _samsvar: boolean;
  _ikkjeForekomst: boolean;
};

export type TestResponse = {
  instanceId: string;
  runtimeStatus: string;
  output: TestResult[];
};
