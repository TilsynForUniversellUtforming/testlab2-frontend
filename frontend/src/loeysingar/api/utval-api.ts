import { responseToJson } from '@common/util/api/util';

import { Utval } from './types';

export const fetchUtvalList = async (): Promise<Utval[]> =>
  await fetch('/api/v1/utval', {
    method: 'GET',
  }).then((response) => responseToJson(response, 'Kunne ikkje hente utval'));
