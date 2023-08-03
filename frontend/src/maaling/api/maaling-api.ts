import { responseToJson } from '@common/util/api/util';

import {
  IdList,
  Maaling,
  MaalingEditParams,
  MaalingInit,
  MaalingStatus,
  RestartRequest,
} from './types';

export const createMaaling = async (maaling: MaalingInit): Promise<Maaling> =>
  await fetch('/api/v1/maalinger', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(maaling),
  }).then((response) => responseToJson(response, 'Kunne ikke lage målingar'));

export const updateMaaling = async (
  maaling: MaalingEditParams
): Promise<Maaling> =>
  await fetch('/api/v1/maalinger', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(maaling),
  }).then((response) =>
    responseToJson(response, 'Kunne ikkje oppdatere måling')
  );

export const deleteMaalingList = async (
  maalingIdList: IdList
): Promise<Maaling[]> =>
  fetch(`/api/v1/maalinger`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(maalingIdList),
  }).then((response) => responseToJson(response, 'Kunne ikkje hente målingar'));

export const updateMaalingStatus = async (
  id: number,
  status: MaalingStatus
): Promise<Maaling> =>
  await fetch(`/api/v1/maalinger/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: status,
  }).then((response) =>
    responseToJson(response, 'Kunne ikkje oppdatere måling')
  );

export const fetchMaalingList = async (): Promise<Maaling[]> =>
  fetch('/api/v1/maalinger', {
    method: 'GET',
  }).then((response) => responseToJson(response, 'Kunne ikkje hente målingar'));

export const fetchMaaling = async (id: number): Promise<Maaling> =>
  fetch(`/api/v1/maalinger/${id}`, {
    method: 'GET',
  }).then((response) => responseToJson(response, 'Kunne ikkje hente måling'));

export const restart = async (
  restartRequest: RestartRequest
): Promise<Maaling> =>
  fetch(
    `/api/v1/maalinger/${restartRequest.maalingId}/restart?process=${restartRequest.process}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(restartRequest.loeysingIdList),
    }
  ).then((response) =>
    responseToJson(response, `Kunne ikkje restarte ${restartRequest.process}`)
  );
