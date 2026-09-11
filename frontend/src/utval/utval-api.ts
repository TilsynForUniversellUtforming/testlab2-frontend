import { responseWithLogErrors } from '@common/util/apiUtils';

import { Utval } from '@loeysingar/api/types';
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

export const getUtvalById = async (
  id: number | undefined
): Promise<Utval> => {
  if (id === undefined) throw new Error(`utvalId ${id} undefined`);
  return await fetchWithErrorHandling(`/api/v1/utval/${id}`).then((response) => response.json());
};

export const updateUtval = async (utval: Utval): Promise<Utval> => {
  return await fetchWithErrorHandling(`/api/v1/utval/${utval.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(utval),
  })
    .then((response) =>
      responseWithLogErrors(response, 'Kunne ikkje oppdatere utval')
    )
    .then((updatedUtval: Utval) => ({
      ...updatedUtval,
      oppretta: new Date(updatedUtval.oppretta),
    }));
};

export const createUtval = async (utval: Omit<Utval, 'id'>): Promise<Utval> => {
  return await fetchWithErrorHandling('/api/v1/utval', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(utval),
  })
    .then((response) =>
      responseWithLogErrors(response, 'Kunne ikkje opprette utval')
    )
    .then((createdUtval: Utval) => ({
      ...createdUtval,
      oppretta: new Date(createdUtval.oppretta),
    }));
};

export const deleteUtval = async (id: number): Promise<void> => {
  return await fetchWithErrorHandling(`/api/v1/utval/${id}`, {
    method: 'DELETE',
  }).then((response) =>
    responseWithLogErrors(response, 'Kunne ikkje slette utval')
  );
};



