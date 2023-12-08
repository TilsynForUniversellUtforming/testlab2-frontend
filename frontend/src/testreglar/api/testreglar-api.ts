import { responseToJson } from '@common/util/apiUtils';

import { Testregel, TestregelCreateRequest } from './types';

export const fetchTestreglarList = async (): Promise<Testregel[]> =>
  await fetch(`/api/v1/testreglar`, {
    method: 'GET',
  }).then((response) =>
    responseToJson(response, 'Kunne ikke hente testreglar')
  );

export const createTestregel = async (
  testregel: TestregelCreateRequest
): Promise<Testregel[]> =>
  await fetch(`/api/v1/testreglar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(testregel),
  }).then((response) =>
    responseToJson(response, 'Kunne ikke lage nytt testregel')
  );

export const updateTestregel = async (
  testregel: Testregel
): Promise<Testregel[]> =>
  await fetch(`/api/v1/testreglar`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(testregel),
  }).then((response) =>
    responseToJson(response, 'Kunne ikke oppdatere testregel')
  );

export const deleteTestregelList = async (
  testregelIdList: number[]
): Promise<Testregel[]> => {
  const response = await fetch(`/api/v1/testreglar`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idList: testregelIdList }),
  });

  if (response.ok) {
    return response.json();
  } else {
    const message = await response.text();
    throw Error(message);
  }
};

export const getTestregel = async (id: number): Promise<Testregel> =>
  await fetch(`/api/v1/testreglar/${id}`, {
    method: 'GET',
  }).then((response) =>
    responseToJson(response, 'Kunne ikke hente testreglar')
  );
