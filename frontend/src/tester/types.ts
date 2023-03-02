import { AppContext } from '../common/types';
import { Maaling } from '../maaling/api/types';

export interface TesterContext extends AppContext {
  maaling?: Maaling;
}
