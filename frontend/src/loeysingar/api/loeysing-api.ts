import { fetchWrapper } from '@common/form/util';
import { responseToJson } from '@common/util/apiUtils';
import { fetchVerksemd } from '@verksemder/api/verksemd-api';

import { Loeysing, LoeysingFormElement, LoeysingInit } from './types';

export const fetchLoeysing = async (id: number): Promise<Loeysing> =>
  await fetch(`/api/v1/loeysing/${id}`, {
    method: 'GET',
  }).then((response) =>
    responseToJson(response, 'Kunne ikkje hente løysingar')
  );

export const findLoeysingByName = async (name: string): Promise<Loeysing[]> =>
  await fetch(`/api/v1/loeysing?name=${name}`, {
    method: 'GET',
  }).then((response) =>
    responseToJson(response, 'Kunne ikkje søke etter virksomhet')
  );

export const findLoeysingByOrgnummer = async (
  orgnummer: string
): Promise<Loeysing[]> =>
  await fetch(`/api/v1/loeysing?orgnummer=${orgnummer}`, {
    method: 'GET',
  }).then((response) =>
    responseToJson(response, 'Kunne ikkje søke etter virksomhet')
  );

export const fetchLoeysingList = async (): Promise<Loeysing[]> =>
  await fetch('/api/v1/loeysing', {
    method: 'GET',
  }).then((response) =>
    responseToJson(response, 'Kunne ikkje hente løysingar')
  );

export const updateLoeysing = async (loeysing: Loeysing): Promise<Loeysing[]> =>
  await fetchWrapper('/api/v1/loeysing', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loeysing),
  }).then((response) =>
    responseToJson(response, 'Kunne ikkje oppdatere løysing')
  );

export const createLoeysing = async (
  loeysingInit: LoeysingInit
): Promise<Loeysing[]> => {
  //const csrfToken = document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/, '$1');
  return await fetchWrapper('/api/v1/loeysing', {
    method: 'POST',
    body: JSON.stringify(loeysingInit),
  }).then((response) =>
    responseToJson(response, 'Kunne ikkje opprette løysing')
  );
};

export const deleteLoeysingList = async (
  loeysingIdList: number[]
): Promise<Loeysing[]> => {
  const response = await fetchWrapper(`/api/v1/loeysing`, {
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
  const loeysing = await fetchLoeysing(id);
  if (loeysing.verksemdId !== null && loeysing.verksemdId !== undefined) {
    const verksemd = await fetchVerksemd(loeysing.verksemdId);
    return {
      id: loeysing.id,
      namn: loeysing.namn,
      url: loeysing.url,
      orgnummer: loeysing.orgnummer,
      verksemd: verksemd,
    };
  } else {
    return {
      id: loeysing.id,
      namn: loeysing.namn,
      url: loeysing.url,
      orgnummer: loeysing.orgnummer,
      verksemd: undefined,
    };
  }
};
