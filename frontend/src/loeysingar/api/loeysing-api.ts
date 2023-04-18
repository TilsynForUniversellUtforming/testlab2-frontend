import { responseToJson } from '../../common/util/api/util';
import { Loeysing, LoeysingInit } from './types';

export const fetchLoeysing = async (id: number): Promise<Loeysing> =>
  await fetch(`/api/v1/loeysing/${id}`, {
    method: 'GET',
  }).then((response) =>
    responseToJson(response, 'Kunne ikkje hente løysingar')
  );

export const fetchLoeysingList = async (): Promise<Loeysing[]> =>
  await fetch('/api/v1/loeysing', {
    method: 'GET',
  }).then((response) =>
    responseToJson(response, 'Kunne ikkje hente løysingar')
  );

export const updateLoysing = async (loeysing: Loeysing): Promise<Loeysing[]> =>
  await fetch('/api/v1/loeysing', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loeysing),
  }).then((response) =>
    responseToJson(response, 'Kunne ikkje oppdatere løysing')
  );

export const createLoysing = async (
  loeysingInit: LoeysingInit
): Promise<Loeysing[]> =>
  await fetch('/api/v1/loeysing', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loeysingInit),
  }).then((response) =>
    responseToJson(response, 'Kunne ikkje opprette løysing')
  );

export const deleteLoysingList = async (
  loeysingIdList: number[]
): Promise<Loeysing[]> => {
  const response = await fetch(`/api/v1/loeysing`, {
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
