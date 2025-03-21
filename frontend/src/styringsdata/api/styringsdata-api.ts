import { fetchWithErrorHandling, fetchWithCsrf } from '@common/form/util';
import { responseWithLogErrors } from '@common/util/apiUtils';

import {
  StyringsdataKontroll,
  StyringsdataLoeysing,
  StyringsdataResult,
} from '../types';

const styringsdataApiBaseUrl = '/api/v1/styringsdata';

export const findStyringsdataForKontroll = async (
  kontrollId: number
): Promise<StyringsdataResult> => {
  return await fetchWithErrorHandling(
    `${styringsdataApiBaseUrl}?kontrollId=${kontrollId}`,
    {
      method: 'GET',
    }
  ).then((response) =>
    responseWithLogErrors(
      response,
      'Kunne ikkje hente styringsdata for kontroll'
    )
  );
};

export const fetchStyringsdataLoeysing = async (
  loeysingStyringsdataId: number
): Promise<StyringsdataLoeysing> => {
  return await fetchWithErrorHandling(
    `${styringsdataApiBaseUrl}/loeysing/${loeysingStyringsdataId}`,
    {
      method: 'GET',
    }
  ).then((response) =>
    responseWithLogErrors(response, 'Kunne ikkje hente styringsdata')
  );
};

export const updateStyringsdataLoeysing = async (
  styringsdata: StyringsdataLoeysing
): Promise<StyringsdataLoeysing> =>
  await fetchWithCsrf(`${styringsdataApiBaseUrl}/${styringsdata.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(styringsdata),
  }).then((response) =>
    responseWithLogErrors(response, 'Kunne ikkje oppdatere styringsdata')
  );

export const createStyringsdataLoeysing = async (
  styringsdata: StyringsdataLoeysing
) =>
  await fetchWithCsrf(styringsdataApiBaseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...styringsdata, type: 'loeysing' }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error('Styringsdata finns allereie');
    }
    return responseWithLogErrors(response, 'Kunne ikkje opprette styringsdata');
  });

export const fetchStyringsdataKontroll = async (
  styringsdataId: number
): Promise<StyringsdataKontroll> => {
  return await fetchWithErrorHandling(
    `${styringsdataApiBaseUrl}/kontroll/${styringsdataId}`,
    {
      method: 'GET',
    }
  ).then((response) =>
    responseWithLogErrors(response, 'Kunne ikkje hente styringsdata')
  );
};

export const updateStyringsdataKontroll = async (
  styringsdata: StyringsdataKontroll
): Promise<StyringsdataKontroll> =>
  await fetchWithCsrf(`${styringsdataApiBaseUrl}/${styringsdata.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(styringsdata),
  }).then((response) =>
    responseWithLogErrors(response, 'Kunne ikkje oppdatere styringsdata')
  );

export const createStyringsdataKontroll = async (
  styringsdata: StyringsdataKontroll
) =>
  await fetchWithCsrf(styringsdataApiBaseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...styringsdata, type: 'kontroll' }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error('Styringsdata finns allereie');
    }
    return responseWithLogErrors(response, 'Kunne ikkje opprette styringsdata');
  });
