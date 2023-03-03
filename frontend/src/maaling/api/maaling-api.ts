import { responseToJson } from '../../common/util/api/util';
import { Maaling, MaalingInit, MaalingStatus } from './types';

export const createMaaling = async (maaling: MaalingInit): Promise<Maaling> =>
  await fetch('/api/v1/maalinger', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(maaling),
  }).then((response) => responseToJson(response, 'Kunne ikke lage målinger'));

export const updateMaaling = async (maaling: MaalingInit): Promise<Maaling> =>
  await fetch('/api/v1/maalinger', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(maaling),
  }).then((response) => responseToJson(response, 'Kunne ikke lage målinger'));

export const startCrawling = async (
  id: number,
  status: MaalingStatus = 'crawling'
): Promise<Maaling> =>
  await fetch(`/api/v1/maalinger/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: status,
  }).then((response) =>
    responseToJson(response, 'Kunne ikke oppdatere måling')
  );

export const fetchMaalingList = async (): Promise<Maaling[]> =>
  fetch('/api/v1/maalinger', {
    method: 'GET',
  }).then((response) => responseToJson(response, 'Kunne ikke hente målinger'));

export const fetchMaaling = async (id: number): Promise<Maaling> =>
  fetch(`/api/v1/maalinger/${id}`, {
    method: 'GET',
  }).then((response) => responseToJson(response, 'Kunne ikke hente måling'));
