import { fetchWithCsrf, fetchWithErrorHandling } from '@common/form/util';
import { responseWithLogErrors } from '@common/util/apiUtils';

import { Verksemd, VerksemdInit } from './types';

const verksemdList_dummy_response = [
  {
    id: 1,
    namn: 'Testverksemd',
    organisasjonsnummer: '123456789',
  },
];

const getVerksemdList_dummy = async () => {
  return verksemdList_dummy_response;
};

export default getVerksemdList_dummy;

export const fetchVerksemd = async (id: number): Promise<Verksemd> => {
  return await fetchWithErrorHandling(`/api/v1/verksemd/${id}`, {
    method: 'GET',
  }).then(async (response) =>
    responseWithLogErrors(response, (await response.json()).detail)
  );
};

export const findVerksemdByName = async (name: string): Promise<Verksemd[]> =>
  await fetchWithErrorHandling(`/api/v1/verksemd/list?name=${name}`, {
    method: 'GET',
  }).then(async (response) =>
    responseWithLogErrors(response, (await response.json()).detail)
  );

export const findVerksemdByOrgnummer = async (
  orgnummer: string
): Promise<Verksemd[]> =>
  await fetchWithErrorHandling(`/api/v1/verksemd/list?orgnummer=${orgnummer}`, {
    method: 'GET',
  }).then(async (response) =>
    responseWithLogErrors(response, (await response.json()).detail)
  );

export const fetchVerksemdList = async (): Promise<Verksemd[]> =>
  await fetchWithErrorHandling('/api/v1/verksemd', {
    method: 'GET',
  }).then(async (response) =>
    responseWithLogErrors(response, (await response.json()).detail)
  );

export const fetchVerksemdMany = async (
  kontrollVerksemdIds: number[]
): Promise<Verksemd[]> =>
  await fetchWithErrorHandling(
    `/api/v1/verksemd?idList=${kontrollVerksemdIds.join(',')}`,
    {
      method: 'GET',
    }
  ).then(async (response) =>
    responseWithLogErrors(response, (await response.json()).detail)
  );

export const updateVerksemd = async (Verksemd: Verksemd): Promise<Verksemd[]> =>
  await fetchWithCsrf('/api/v1/verksemd', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(Verksemd),
  }).then(async (response) =>
    responseWithLogErrors(response, (await response.json()).detail)
  );

export const createVerksemd = async (
  VerksemdInit: VerksemdInit
): Promise<Verksemd[]> => {
  return await fetchWithCsrf('/api/v1/verksemd', {
    method: 'POST',
    body: JSON.stringify(VerksemdInit),
  }).then(async (response) =>
    responseWithLogErrors(response, (await response.json()).detail)
  );
};

export const deleteVerksemd = async (
  verksemdId: number[]
): Promise<Verksemd[]> => {
  const response = await fetchWithCsrf(`/api/v1/verksemd`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ verksemdId }),
  });

  if (response.ok) {
    return response.json();
  } else {
    const message = await response.text();
    throw new Error(message);
  }
};
