import { responseToJson } from '../../common/util/api/util';
import {
  Maaling,
  MaalingEdit,
  MaalingIdList,
  MaalingInit,
  MaalingStatus,
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
  maalingIdList: MaalingIdList
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
  maalingId: number,
  loeysingId: number
): Promise<Maaling> =>
  fetch(`/api/v1/maalinger/${maalingId}/${loeysingId}`, {
    method: 'PUT',
  }).then((response) =>
    responseToJson(response, 'Kunne ikkje restarte måling')
  );
