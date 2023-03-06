export type TestElement = {
  htmlCode: string;
  pointer: string;
  accessibleName: string;
};

export type RuntimeStatus = 'Pending' | 'Running' | 'Completed';

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

export type TestResultat = {
  instanceId: string;
  runtimeStatus: RuntimeStatus;
  output: TestResult[];
};

export interface TestInputParameters {
  url: string;
}
