import { AppContext } from '../common/types';
import { Loeysing } from '../loeysingar/api/types';
import { MaalingInit } from '../maaling/api/types';

export interface TesterContext extends AppContext {
  onSubmitMaalingInit: (maalingInit: MaalingInit) => void;
  loeysingList: Loeysing[];
  setLoeysingList: (loeysingList: []) => void;
}
