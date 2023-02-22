import { AppContext } from '../common/types';
import { Loeysing, MaalingInit } from './api/types';

export interface TesterContext extends AppContext {
  onSubmitMaalingInit: (maalingInit: MaalingInit) => void;
  loeysingList: Loeysing[];
  setLoeysingList: (loeysingList: []) => void;
}
