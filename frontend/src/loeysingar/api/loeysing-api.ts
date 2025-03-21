import { fetchWithCsrf, fetchWithErrorHandling } from '@common/form/util';
import { responseWithLogErrors } from '@common/util/apiUtils';

import { Loeysing, LoeysingFormElement, LoeysingInit } from './types';

export const fetchLoeysing = async (id: number): Promise<Loeysing> =>
  await fetchWithErrorHandling(`/api/v1/loeysing/${id}`, {
    method: 'GET',
  }).then((response) =>
    responseWithLogErrors(response, 'Kunne ikkje hente løysingar')
  );

export const findLoeysingByName = async (name: string): Promise<Loeysing[]> =>
  await fetchWithErrorHandling(`/api/v1/loeysing?name=${name}`, {
    method: 'GET',
  }).then((response) =>
    responseWithLogErrors(response, 'Kunne ikkje søke etter virksomhet')
  );

export const findLoeysingByOrgnummer = async (
  orgnummer: string
): Promise<Loeysing[]> =>
  await fetchWithErrorHandling(`/api/v1/loeysing?orgnummer=${orgnummer}`, {
    method: 'GET',
  }).then((response) =>
    responseWithLogErrors(response, 'Kunne ikkje søke etter virksomhet')
  );

export const fetchLoeysingList = async (): Promise<Loeysing[]> =>
  await fetchWithErrorHandling('/api/v1/loeysing', {
    method: 'GET',
  }).then((response) =>
    responseWithLogErrors(response, 'Kunne ikkje hente løysingar')
  );

export const updateLoeysing = async (loeysing: Loeysing): Promise<Loeysing[]> =>
  await fetchWithCsrf('/api/v1/loeysing', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loeysing),
  }).then((response) =>
    responseWithLogErrors(response, 'Kunne ikkje oppdatere løysing')
  );

export const createLoeysing = async (
  loeysingInit: LoeysingInit
): Promise<Loeysing[]> => {
  return await fetchWithCsrf('/api/v1/loeysing', {
    method: 'POST',
    body: JSON.stringify(loeysingInit),
  }).then((response) =>
    responseWithLogErrors(response, 'Kunne ikkje opprette løysing')
  );
};

export const deleteLoeysingList = async (
  loeysingIdList: number[]
): Promise<Loeysing[]> => {
  const response = await fetchWithCsrf(`/api/v1/loeysing`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ loeysingIdList: loeysingIdList }),
  });

  if (response.ok) {
    return response.json();
  } else {
    const message = await response.text();
    throw Error(message);
  }
};

export const fetchLoeysingFormElement = async (
  id: number
): Promise<LoeysingFormElement> => {
  return await fetchWithErrorHandling(`/api/v1/loeysing/${id}/withVerksemd`, {
    method: 'GET',
  }).then((response) =>
    responseWithLogErrors(response, 'Kunne ikkje hente løysingar')
  );
};
