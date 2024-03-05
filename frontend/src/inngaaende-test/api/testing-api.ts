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
  testResultat: CreateTestResultat
): Promise<ResultatManuellKontroll[]> => {
  return await fetch(`/api/v1/testing`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(testResultat),
  }).then((response) =>
    responseToJson(response, 'Kunne ikkje opprette testresultat')
  );
};

export const updateTestResultat = async (
  testResultat: ResultatManuellKontroll
): Promise<ResultatManuellKontroll[]> => {
  return await fetch(`/api/v1/testing`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([testResultat]),
  }).then((response) =>
    responseToJson(response, 'Kunne ikkje oppdatere testresultat')
  );
};

export const updateTestResultatMany = async (
  testResultatList: ResultatManuellKontroll[]
): Promise<ResultatManuellKontroll[]> => {
  return await fetch(`/api/v1/testing`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(testResultatList),
  }).then((response) =>
    responseToJson(response, 'Kunne ikkje oppdatere testresultat')
  );
};

export const deleteTestResultat = async (
  resultat: ResultatManuellKontroll
): Promise<ResultatManuellKontroll[]> => {
  return await fetch(`/api/v1/testing`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(resultat),
  }).then((response) =>
    responseToJson(response, 'Kunne ikkje slette testresultat')
  );
};
