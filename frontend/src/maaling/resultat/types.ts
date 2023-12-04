import { AppContext } from '@common/types';
import { Maaling, TestResult } from '@maaling/api/types';

export interface TestResultContext extends AppContext {
  maaling?: Maaling;
  refreshMaaling: () => void;
  onClickRestart: () => void;
  loeysingTestResult?: TestResult;
}
