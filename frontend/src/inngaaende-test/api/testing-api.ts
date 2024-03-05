import { responseToJson } from '@common/util/apiUtils';

import { CreateTestResultat, ResultatManuellKontroll } from './types';

const testingApiBaseUrl = '/api/v1/testing';

export const getTestResults = async (
  sakId: number
): Promise<ResultatManuellKontroll[]> => {
  return await fetch(`${testingApiBaseUrl}/${sakId}`, {
    method: 'GET',
  }).then((response) =>
    responseToJson(response, 'Kunne ikke hente testresultat')
  );
};

export const createTestResultat = async (
  testResultat: CreateTestResultat
): Promise<ResultatManuellKontroll[]> => {
  return await fetch(testingApiBaseUrl, {
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
  return await fetch(testingApiBaseUrl, {
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
  return await fetch(testingApiBaseUrl, {
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
  return await fetch(testingApiBaseUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(resultat),
  }).then((response) =>
    responseToJson(response, 'Kunne ikkje slette testresultat')
  );
};

export const uploadBilde = async (bilde: File): Promise<void> => {
  const formData = new FormData();
  formData.append('bilde', bilde);

  await fetch(`${testingApiBaseUrl}/bilder`, {
    method: 'POST',
    body: formData,
  });
};
