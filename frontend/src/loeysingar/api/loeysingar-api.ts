import { responseToJson } from '../../common/util/api/util';
import { Loeysing } from './types';

export const fetchLoysingar = async (): Promise<Loeysing[]> =>
  await fetch(`/api/v1/maalinger/loeysingar`, {
    method: 'GET',
  }).then((response) => responseToJson(response, 'Kunne ikke hente løsninger'));
