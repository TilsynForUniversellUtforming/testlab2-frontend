import { AppContext } from '@common/types';

import { Loeysing } from './api/types';

export interface LoeysingContext extends AppContext {
  loeysingList: Loeysing[];
  setLoeysingList: (loeysingList: Loeysing[]) => void;
}
