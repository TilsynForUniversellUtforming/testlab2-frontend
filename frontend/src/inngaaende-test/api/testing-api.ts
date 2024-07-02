import { fetchWrapper } from '@common/form/util';
import { responseToJson } from '@common/util/apiUtils';
import { Styringsdata } from '@test/styringsdata/types';
import { Testgrunnlag } from '@test/types';
import { fetchVerksemd } from '@verksemder/api/verksemd-api';

import { fetchKontroll } from '../../kontroll/kontroll-api';
import { Kontroll } from '../../kontroll/types';
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
}) => {
  return await fetchWrapper(
    `/api/v1/kontroller/${nyttTestgrunnlag.kontrollId}/testgrunnlag`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nyttTestgrunnlag),
    }
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

export const fetchStyringsdata = async (
  kontrollId: number,
  loeysingId: number
) => {
  const [kontrollPromise, styringsdataPromise] = await Promise.allSettled([
    fetchKontroll(kontrollId),
    fetchStyringsdata_dummy(),
  ]);

  if (kontrollPromise.status === 'rejected') {
    throw new Error(`Kunne ikkje hente kontroll med id ${kontrollId}`);
  }

  const kontrollResponse = kontrollPromise.value;

  if (!kontrollResponse.ok) {
    if (kontrollResponse.status === 404) {
      throw new Error('Det finnes ikke en kontroll med id ' + kontrollId);
    } else {
      throw new Error('Klarte ikke å hente kontrollen.');
    }
  }
  const kontroll: Kontroll = await kontrollResponse.json();

  if (styringsdataPromise.status === 'rejected') {
    throw new Error(
      `Kunne ikkje hente styringsdata for kontroll med id ${kontrollId}`
    );
  }

  const loeysing = kontroll.utval?.loeysingar?.find((l) => l.id === loeysingId);
  let verksemdNamn = loeysing?.orgnummer ?? '';
  if (loeysing?.verksemdId) {
    const verksemd = await fetchVerksemd(loeysing.verksemdId);
    verksemdNamn = verksemd.namn;
  }

  return {
    kontrollTittel: kontroll.tittel,
    arkivreferanse: kontroll.arkivreferanse,
    loeysingNamn: loeysing?.namn ?? '',
    styringsdata: styringsdataPromise.value,
    verksemdNamn: verksemdNamn,
  };
};

const fetchStyringsdata_dummy = (): Styringsdata | undefined => undefined;
