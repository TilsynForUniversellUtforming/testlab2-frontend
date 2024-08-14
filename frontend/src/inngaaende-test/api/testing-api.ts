import { fetchWrapper } from '@common/form/util';
import { responseToJson } from '@common/util/apiUtils';
import { Testgrunnlag } from '@test/types';

import { Bilde, CreateTestResultat, ResultatManuellKontroll } from './types';

const testingApiBaseUrl = '/api/v1/testing';

export const fetchTestResults = async (
  testgrunnlagId: number
): Promise<ResultatManuellKontroll[]> => {
  return await fetch(`${testingApiBaseUrl}/${testgrunnlagId}`, {
    method: 'GET',
  }).then((response) =>
    responseToJson(response, 'Kunne ikke hente testresultat')
  );
};

export const createTestResultat = async (
  testResultat: CreateTestResultat
): Promise<ResultatManuellKontroll> => {
  return await fetchWrapper(testingApiBaseUrl, {
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
  return await fetchWrapper(testingApiBaseUrl, {
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
  return await fetchWrapper(testingApiBaseUrl, {
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
  return await fetchWrapper(testingApiBaseUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(resultat),
  }).then((response) =>
    responseToJson(response, 'Kunne ikkje slette testresultat')
  );
};

export const uploadBilde = async (
  bilde: File,
  resultatId: number
): Promise<Bilde[]> => {
  const formData = new FormData();
  formData.append('bilde', bilde);
  formData.append('resultatId', String(resultatId));

  return await fetchWrapper(
    `${testingApiBaseUrl}/bilder?includeBilder=true`,
    {
      method: 'POST',
      body: formData,
    },
    false
  ).then((response) => responseToJson(response, 'Kunne ikkje lagre bilde'));
};

export const getBilder = async (resultatId: number): Promise<Bilde[]> =>
  await fetchWrapper(`${testingApiBaseUrl}/bilder/${resultatId}`).then(
    (response) => responseToJson(response, 'Kunne ikkje hente bilder')
  );

export const deleteBilde = async (
  resultatId: number,
  bildeId: number
): Promise<Bilde[]> =>
  await fetchWrapper(`${testingApiBaseUrl}/bilder/${resultatId}/${bildeId}`, {
    method: 'DELETE',
  }).then((response) => responseToJson(response, 'Kunne ikkje slette bilde'));

export const listTestgrunnlag = async (
  kontrollId: number
): Promise<Testgrunnlag[]> =>
  await fetch(`/api/v1/kontroller/${kontrollId}/testgrunnlag`).then(
    (response) =>
      responseToJson(response, 'Klarte ikke å hente liste med testgrunnlag')
  );

export const postTestgrunnlag = async (nyttTestgrunnlag: {
  kontrollId: number;
}): Promise<Testgrunnlag> => {
  return await fetchWrapper(
    `/api/v1/kontroller/${nyttTestgrunnlag.kontrollId}/testgrunnlag`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nyttTestgrunnlag),
    }
  ).then((response) =>
    responseToJson(response, 'Kunne ikkje opprette testgrunnlag')
  );
};

export const deleteTestgrunnlag = async (testgrunnlag: Testgrunnlag) => {
  return await fetchWrapper(
    `/api/v1/kontroller/${testgrunnlag.kontrollId}/testgrunnlag/${testgrunnlag.id}`,
    {
      method: 'DELETE',
    }
  );
};
