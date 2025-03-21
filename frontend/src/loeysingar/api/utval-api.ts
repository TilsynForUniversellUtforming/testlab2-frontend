import { responseWithLogErrors } from '@common/util/apiUtils';

import { Utval } from './types';
import { fetchWithErrorHandling } from '@common/form/util';

export const fetchUtvalList = async (): Promise<Utval[]> =>
  await fetchWithErrorHandling('/api/v1/utval', {
    method: 'GET',
  })
    .then((response) =>
      responseWithLogErrors(response, 'Kunne ikkje hente utval')
    )
    .then((utval: Utval[]) =>
      utval.map((u) => ({ ...u, oppretta: new Date(u.oppretta) }))
    );

export const getUtvalById = async (id: number): Promise<Response> =>
  await fetchWithErrorHandling(`/api/v1/utval/${id}`);
