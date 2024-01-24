import { responseToJson } from '@common/util/apiUtils';

import { CreateTestResultat, ResultatManuellKontroll } from './types';

export const getTestResults = async (
  sakId: number
): Promise<ResultatManuellKontroll[]> => {
  return await fetch(`/api/v1/testing/${sakId}`, {
    method: 'GET',
  }).then((response) =>
    responseToJson(response, 'Kunne ikke hente testresultat')
  );
};

export const createTestResultat = async (
  testResulat: CreateTestResultat
): Promise<ResultatManuellKontroll[]> => {
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
  testResulat: ResultatManuellKontroll
): Promise<ResultatManuellKontroll[]> => {
  return await fetch(`/api/v1/testing`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(testResulat),
  }).then((response) =>
    responseToJson(response, 'Kunne ikkje oppdatere testresultat')
  );
};
