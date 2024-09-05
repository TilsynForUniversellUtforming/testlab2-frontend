import { fetchWrapper } from '@common/form/util';
import { responseToJson } from '@common/util/apiUtils';

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
  return await fetch(`/api/v1/verksemd/${id}`, {
    method: 'GET',
  }).then((response) =>
    responseToJson(response, 'Kunne ikkje hente løysingar')
  );
};

export const findVerksemdByName = async (name: string): Promise<Verksemd[]> =>
  await fetch(`/api/v1/verksemd/list?name=${name}`, {
    method: 'GET',
  }).then((response) =>
    responseToJson(response, 'Kunne ikkje søke etter virksomhet')
  );

export const findVerksemdByOrgnummer = async (
  orgnummer: string
): Promise<Verksemd[]> =>
  await fetch(`/api/v1/verksemd/list?orgnummer=${orgnummer}`, {
    method: 'GET',
  }).then((response) =>
    responseToJson(response, 'Kunne ikkje søke etter virksomhet')
  );

export const fetchVerksemdList = async (): Promise<Verksemd[]> =>
  await fetch('/api/v1/verksemd', {
    method: 'GET',
  }).then((response) =>
    responseToJson(response, 'Kunne ikkje hente løysingar')
  );

export const fetchVerksemdMany = async (
  kontrollVerksemdIds: number[]
): Promise<Verksemd[]> =>
  await fetch(`/api/v1/verksemd?idList=${kontrollVerksemdIds.join(',')}`, {
    method: 'GET',
  }).then((response) =>
    responseToJson(response, 'Kunne ikkje hente verksemder')
  );

export const updateVerksemd = async (Verksemd: Verksemd): Promise<Verksemd[]> =>
  await fetchWrapper('/api/v1/verksemd', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(Verksemd),
  }).then((response) =>
    responseToJson(response, 'Kunne ikkje oppdatere løysing')
  );

export const createVerksemd = async (
  VerksemdInit: VerksemdInit
): Promise<Verksemd[]> => {
  return await fetchWrapper('/api/v1/verksemd', {
    method: 'POST',
    body: JSON.stringify(VerksemdInit),
  }).then((response) =>
    responseToJson(response, 'Kunne ikkje opprette løysing')
  );
};

export const deleteVerksemd = async (
  verksemdId: number[]
): Promise<Verksemd[]> => {
  const response = await fetchWrapper(`/api/v1/verksemd`, {
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
    throw Error(message);
  }
};
