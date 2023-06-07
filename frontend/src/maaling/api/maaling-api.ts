import { responseToJson } from '../../common/util/api/util';
import {
  IdList,
  Maaling,
  MaalingEdit,
  MaalingInit,
  MaalingStatus,
  RestartCrawlRequest,
} from './types';

export const createMaaling = async (maaling: MaalingInit): Promise<Maaling> =>
  await fetch('/api/v1/maalinger', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(maaling),
  }).then((response) => responseToJson(response, 'Kunne ikke lage målinger'));

export const updateMaaling = async (maaling: MaalingEdit): Promise<Maaling> =>
  await fetch('/api/v1/maalinger', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(maaling),
  }).then((response) =>
    responseToJson(response, 'Kunne ikke oppdatere måling')
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
  }).then((response) => responseToJson(response, 'Kunne ikke hente målinger'));

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

export const restartCrawling = async (
  restartCrawlRequest: RestartCrawlRequest
): Promise<Maaling> =>
  fetch(`/api/v1/maalinger/${restartCrawlRequest.maalingId}/restart`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(restartCrawlRequest.loeysingIdList),
  }).then((response) =>
    responseToJson(response, 'Kunne ikkje restarte måling')
  );
