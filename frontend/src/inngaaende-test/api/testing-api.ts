import { fetchWithErrorHandling, fetchWithCsrf } from '@common/form/util';
import { responseWithLogErrors } from '@common/util/apiUtils';
import { Testgrunnlag } from '@test/types';

import {
  Bilde,
  CreateTestResultat,
  ResultatManuellKontroll,
  RetestRequest,
} from './types';

const testingApiBaseUrl = '/api/v1/testing';

const kontrollApiBaseUrl = '/api/v1/kontroller';

export const fetchTestResults = async (
  testgrunnlagId: number
): Promise<ResultatManuellKontroll[]> => {
  return await fetchWithErrorHandling(
    `${testingApiBaseUrl}/${testgrunnlagId}`,
    {
      method: 'GET',
    }
  ).then((response) =>
    responseWithLogErrors(response, 'Kunne ikke hente testresultat')
  );
};

export const createTestResultat = async (
  testResultat: CreateTestResultat
): Promise<ResultatManuellKontroll> => {
  return await fetchWithCsrf(testingApiBaseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(testResultat),
  }).then((response) =>
    responseWithLogErrors(response, 'Kunne ikkje opprette testresultat')
  );
};

export const updateTestResultat = async (
  testResultat: ResultatManuellKontroll
): Promise<ResultatManuellKontroll[]> => {
  return await fetchWithCsrf(testingApiBaseUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([testResultat]),
  }).then((response) =>
    responseWithLogErrors(response, 'Kunne ikkje oppdatere testresultat')
  );
};

export const updateTestResultatMany = async (
  testResultatList: ResultatManuellKontroll[]
): Promise<ResultatManuellKontroll[]> => {
  return await fetchWithCsrf(testingApiBaseUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(testResultatList),
  }).then((response) =>
    responseWithLogErrors(response, 'Kunne ikkje oppdatere testresultat')
  );
};

export const deleteTestResultat = async (
  resultat: ResultatManuellKontroll
): Promise<ResultatManuellKontroll[]> => {
  return await fetchWithCsrf(testingApiBaseUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(resultat),
  }).then((response) =>
    responseWithLogErrors(response, 'Kunne ikkje slette testresultat')
  );
};

export const uploadBilde = async (
  bilde: File,
  resultatId: number
): Promise<Bilde[]> => {
  const formData = new FormData();
  formData.append('bilde', bilde);
  formData.append('resultatId', String(resultatId));

  return await fetchWithCsrf(
    `${testingApiBaseUrl}/bilder?includeBilder=true`,
    {
      method: 'POST',
      body: formData,
    },
    false
  ).then((response) =>
    responseWithLogErrors(response, 'Kunne ikkje lagre bilde')
  );
};

export const getBilder = async (resultatId: number): Promise<Bilde[]> =>
  await fetchWithCsrf(`${testingApiBaseUrl}/bilder/${resultatId}`).then(
    (response) => responseWithLogErrors(response, 'Kunne ikkje hente bilder')
  );

export const deleteBilde = async (
  resultatId: number,
  bildeId: number
): Promise<Bilde[]> =>
  await fetchWithCsrf(`${testingApiBaseUrl}/bilder/${resultatId}/${bildeId}`, {
    method: 'DELETE',
  }).then((response) =>
    responseWithLogErrors(response, 'Kunne ikkje slette bilde')
  );

export const listTestgrunnlag = async (
  kontrollId: number
): Promise<Testgrunnlag[]> =>
  await fetchWithErrorHandling(
    `${kontrollApiBaseUrl}/${kontrollId}/testgrunnlag`
  ).then((response) =>
    responseWithLogErrors(
      response,
      'Klarte ikke å hente liste med testgrunnlag'
    )
  );

export const createRetest = async (
  retestParams: RetestRequest
): Promise<Testgrunnlag> => {
  return await fetchWithCsrf(
    `${kontrollApiBaseUrl}/${retestParams.kontrollId}/testgrunnlag/retest`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(retestParams),
    }
  ).then((response) =>
    responseWithLogErrors(response, 'Kunne ikkje opprette retest')
  );
};

export const postTestgrunnlag = async (nyttTestgrunnlag: {
  kontrollId: number;
}): Promise<Testgrunnlag> => {
  return await fetchWithCsrf(
    `${kontrollApiBaseUrl}/${nyttTestgrunnlag.kontrollId}/testgrunnlag`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nyttTestgrunnlag),
    }
  ).then((response) =>
    responseWithLogErrors(response, 'Kunne ikkje opprette testgrunnlag')
  );
};

export const deleteTestgrunnlag = async (testgrunnlag: Testgrunnlag) => {
  return await fetchWithCsrf(
    `${kontrollApiBaseUrl}/${testgrunnlag.kontrollId}/testgrunnlag/${testgrunnlag.id}`,
    {
      method: 'DELETE',
    }
  );
};
