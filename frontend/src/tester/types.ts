import { AppContext } from '../common/types';
import { Loeysing } from '../loeysingar/api/types';
import { Maaling, MaalingInit } from '../maaling/api/types';

export interface TesterContext extends AppContext {
  maaling?: Maaling;
  setMaaling: (maaling: Maaling) => void;
  onSubmitMaalingLoeysingList: (maalingInit: MaalingInit) => void;
  loeysingList: Loeysing[];
  setLoeysingList: (loeysingList: []) => void;
}
