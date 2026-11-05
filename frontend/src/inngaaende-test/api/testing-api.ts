import { fetchWithErrorHandling, fetchWithCsrf } from '@common/form/util';
import { responseWithLogErrors } from '@common/util/apiUtils';
import { Testgrunnlag, TestgrunnlagOverviewElement } from '@test/types';

import {
  Bilde,
  CreateTestResultat,
  DeleteTestgrunnlagRequest,
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
  ).then(async (response) =>
    responseWithLogErrors(response, (await response.json()).detail)
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
  }).then(async (response) =>
    responseWithLogErrors(response, (await response.json()).detail)
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
  }).then(async (response) =>
    responseWithLogErrors(response, (await response.json()).detail)
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
  }).then(async (response) =>
    responseWithLogErrors(response, (await response.json()).detail)
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
  }).then(async (response) =>
    responseWithLogErrors(response, (await response.json()).detail)
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
  ).then(async (response) =>
    responseWithLogErrors(response, (await response.json()).detail)
  );
};

export const getBilder = async (resultatId: number): Promise<Bilde[]> =>
  await fetchWithCsrf(`${testingApiBaseUrl}/bilder/${resultatId}`).then(
    async (response) => responseWithLogErrors(response, (await response.json()).detail)
  );

export const deleteBilde = async (
  resultatId: number,
  bildeId: number
): Promise<Bilde[]> =>
  await fetchWithCsrf(`${testingApiBaseUrl}/bilder/${resultatId}/${bildeId}`, {
    method: 'DELETE',
  }).then(async (response) =>
    responseWithLogErrors(response, (await response.json()).detail)
  );

export const listTestgrunnlag = async (kontrollId: number): Promise<Testgrunnlag[]> =>
  await fetchWithErrorHandling(
    `${kontrollApiBaseUrl}/${kontrollId}/testgrunnlag`
  ).then(async (response) =>
    responseWithLogErrors(response, (await response.json()).detail)
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
  ).then(async (response) =>
    responseWithLogErrors(response, (await response.json()).detail)
  );
};
export const deleteTestgrunnlag = async (deleteRetestRequest: DeleteTestgrunnlagRequest) => {
  return await fetchWithCsrf(
    `${kontrollApiBaseUrl}/${deleteRetestRequest.kontrollId}/testgrunnlag/${deleteRetestRequest.testgrunnlagId}`,
    {
      method: 'DELETE',
    }
  );
};

export const getTestoverview = async (
  kontrollId: number
): Promise<TestgrunnlagOverviewElement[]> => {
  return await fetchWithErrorHandling(
    `${testingApiBaseUrl}/testoverview/kontroll/${kontrollId}`,
    {}
  ).then(async (response) =>
    responseWithLogErrors(response, (await response.json()).detail)
  );
};

export const getTestoverviewForBrukar = async (): Promise<TestgrunnlagOverviewElement[]> => {
  return await fetchWithErrorHandling(
    `${testingApiBaseUrl}/testoverview/byUser`,
    {}
  ).then(async (response) =>
    responseWithLogErrors(response, (await response.json()).detail)
  );
};
