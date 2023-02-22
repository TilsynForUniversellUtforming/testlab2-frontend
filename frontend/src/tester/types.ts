import { AppContext } from '../common/types';
import { Loeysing } from './api/types';

export type LoeysingList = {
  loeysingList: Loeysing[];
};

export type TestingStatus =
  | 'init'
  | 'crawling'
  | 'kvalitetssikring'
  | 'testing';

export type TestingForm = {
  loeysingList: LoeysingList;
  status: TestingStatus;
};

export interface TesterContext extends AppContext {
  onSubmitLoeysingar: (loeysingList: LoeysingList) => void;
  loeysingList: LoeysingList;
  testingForm?: TestingForm;
  setLoeysingList: (loeysingList: Loeysing[]) => void;
}
