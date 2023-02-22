import { AppContext } from '../common/types';
import { Maaling } from './api/types';

export interface MaalingContext extends AppContext {
  maalingList: Maaling[];
}
