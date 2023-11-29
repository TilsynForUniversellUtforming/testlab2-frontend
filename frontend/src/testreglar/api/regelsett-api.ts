import { responseToJson } from '@common/util/apiUtils';
import {
  Regelsett,
  RegelsettCreate,
  RegelsettEdit,
} from '@testreglar/api/types';

export const fetchRegelsettList = async (
  includeTestreglar: boolean = false,
  includeInactive: boolean = false
): Promise<Regelsett[]> => {
  const params = new URLSearchParams();
  params.append('includeTestreglar', includeTestreglar.toString());
  params.append('includeInactive', includeInactive.toString());

  return await fetch(`/api/v1/regelsett?${params.toString()}`, {
    method: 'GET',
  }).then((response) => responseToJson(response, 'Kunne ikke hente regelsett'));
};

export const deleteRegelsettList = async (
  regelsettIdList: number[]
): Promise<Regelsett[]> => {
  return await fetch(`/api/v1/regelsett`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idList: regelsettIdList }),
  }).then((response) =>
    responseToJson(response, 'Kunne ikkje slette regelsett')
  );
};

export const createRegelsett = async (
  regelsettCreate: RegelsettCreate
): Promise<Regelsett[]> =>
  await fetch(`/api/v1/regelsett`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(regelsettCreate),
  }).then((response) =>
    responseToJson(response, 'Kunne ikkje lage nytt regelsett')
  );

export const updateRegelsett = async (
  regelsett: RegelsettEdit
): Promise<Regelsett[]> =>
  await fetch(`/api/v1/regelsett`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(regelsett),
  }).then((response) =>
    responseToJson(response, 'Kunne ikkje oppdatere regelsett')
  );
