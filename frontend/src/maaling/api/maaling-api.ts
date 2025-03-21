import { fetchWithCsrf, fetchWithErrorHandling } from '@common/form/util';
import { responseWithLogErrors } from '@common/util/apiUtils';
import { CrawlUrl } from '@maaling/types';

import {
  CrawlParameters,
  IdList,
  Maaling,
  MaalingEditParams,
  MaalingInit,
  MaalingStatus,
  RestartRequest,
  TesterResult,
} from './types';

export const createMaaling = async (maaling: MaalingInit): Promise<Maaling> =>
  await fetchWithCsrf('/api/v1/maalinger', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(maaling),
  }).then((response) =>
    responseWithLogErrors(
      response,
      'Kunne ikkje oppretta måling, ver vennleg og prøv igjen seinare'
    )
  );

export const updateMaaling = async (
  maaling: MaalingEditParams
): Promise<Maaling> =>
  await fetchWithCsrf('/api/v1/maalinger', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(maaling),
  }).then((response) =>
    responseWithLogErrors(response, 'Kunne ikkje oppdatere måling')
  );

export const fetchCrawlParametersKontroll = async (
  kontrollId: number
): Promise<CrawlParameters> =>
  await fetchWithCsrf(
    `/api/v1/maalinger/crawlparameters/kontroll/${kontrollId}`,
    {
      method: 'GET',
    }
  ).then((response) =>
    responseWithLogErrors(response, 'Kunne ikkje hente crawl-parametere')
  );

export const updateCrawlParameters = async (
  kontrollId: number,
  crawlParameters: CrawlParameters
): Promise<void> =>
  await fetchWithCsrf(
    `/api/v1/maalinger/crawlparameters/kontroll/${kontrollId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(crawlParameters),
    }
  ).then((response) =>
    responseWithLogErrors(response, 'Kunne ikkje oppdatere crawl-parametere')
  );

export const deleteMaalingList = async (
  maalingIdList: IdList
): Promise<Maaling[]> =>
  fetchWithCsrf(`/api/v1/maalinger`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(maalingIdList),
  }).then((response) =>
    responseWithLogErrors(response, 'Kunne ikkje hente målingar')
  );

export const updateMaalingStatus = async (
  id: number,
  status: MaalingStatus
): Promise<Maaling> =>
  await fetchWithCsrf(`/api/v1/maalinger/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: status,
  }).then((response) =>
    responseWithLogErrors(response, 'Kunne ikkje oppdatere måling')
  );

export const fetchMaalingList = async (): Promise<Maaling[]> =>
  fetchWithErrorHandling('/api/v1/maalinger', {
    method: 'GET',
  }).then((response) =>
    responseWithLogErrors(response, 'Kunne ikkje hente målingar')
  );

export const fetchMaaling = async (id: number): Promise<Maaling> =>
  fetchWithErrorHandling(`/api/v1/maalinger/${id}`, {
    method: 'GET',
  }).then((response) =>
    responseWithLogErrors(response, 'Kunne ikkje hente måling')
  );

export const restart = async (
  restartRequest: RestartRequest
): Promise<Maaling> =>
  fetchWithCsrf(
    `/api/v1/maalinger/${restartRequest.maalingId}/restart?process=${restartRequest.process}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(restartRequest.loeysingIdList),
    }
  ).then((response) =>
    responseWithLogErrors(
      response,
      `Kunne ikkje restarte ${restartRequest.process}`
    )
  );

export const fetchLoeysingNettsider = async (
  maalingId: number,
  loeysingId: number
): Promise<CrawlUrl[]> =>
  fetchWithErrorHandling(
    `/api/v1/maalinger/${maalingId}/crawlresultat/nettsider?loeysingId=${loeysingId}`,
    {
      method: 'GET',
    }
  ).then((response) =>
    responseWithLogErrors(response, 'Kunne ikkje hente sideutval for måling')
  );

export const fetchTestResultatLoeysing = async (
  maalingId: number,
  loeysingId: number
): Promise<TesterResult[]> =>
  await fetchWithErrorHandling(
    `/api/v1/maalinger/${maalingId}/resultat?loeysingId=${loeysingId}`,
    {
      method: 'GET',
    }
  ).then((response) =>
    responseWithLogErrors(response, 'Kunne ikkje hente løysingar')
  );

export const getMaalingIdFromKontrollId = async (
  kontrollId: number
): Promise<number> =>
  await fetchWithErrorHandling(`/api/v1/maalinger/kontroll/${kontrollId}`, {
    method: 'GET',
  }).then((response) =>
    responseWithLogErrors(response, 'Kunne ikkje hente løysingar')
  );
