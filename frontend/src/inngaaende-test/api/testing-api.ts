import { responseToJson } from '@common/util/apiUtils';

import { CreateTestResultat, ManualTestResultat } from './types';

export const getManuellKontrollResults = async (
  sakId: number
): Promise<ManualTestResultat[]> => {
  return await fetch(`/api/v1/testing/${sakId}`, {
    method: 'GET',
  }).then((response) =>
    responseToJson(response, 'Kunne ikke hente testresultat')
  );
};

export const createTestResultat = async (
  testResulat: CreateTestResultat
): Promise<ManualTestResultat[]> => {
  return await fetch(`/api/v1/testing`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(testResulat),
  }).then((response) =>
    responseToJson(response, 'Kunne ikkje opprette testresultat')
  );
};

export const updateTestResultat = async (
  testResulat: ManualTestResultat
): Promise<ManualTestResultat[]> => {
  return await fetch(`/api/v1/testing`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(testResulat),
  }).then((response) =>
    responseToJson(response, 'Kunne ikkje oppdatere testresultat')
  );
};
