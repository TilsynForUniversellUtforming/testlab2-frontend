import { responseToJson } from '@common/util/api/util';

import { TestResultat } from './types';

const fetchTestResultatLoeysing = async (
  id: number,
  loeysingId: number
): Promise<TestResultat[]> =>
  await fetch(`/api/v1/testing/${id}/resultat?loeysingId=${loeysingId}`, {
    method: 'GET',
  }).then((response) =>
    responseToJson(response, 'Kunne ikkje hente løysingar')
  );

export default fetchTestResultatLoeysing;
