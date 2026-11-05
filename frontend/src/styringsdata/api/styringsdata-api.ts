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
      response.statusText
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
    responseWithLogErrors(response, response.statusText)
  );
};

export const updateStyringsdataLoeysing = async (
  styringsdata: StyringsdataLoeysing
): Promise<StyringsdataLoeysing> =>
{
  console.log(JSON.stringify(styringsdata));
  return await fetchWithCsrf(`${styringsdataApiBaseUrl}/${styringsdata.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(styringsdata),
  }).then(async (response) =>
    responseWithLogErrors(response, (await response.json()).message)
  );
}

export const createStyringsdataLoeysing = async (styringsdata: StyringsdataLoeysing) =>
  await fetchWithCsrf(styringsdataApiBaseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...styringsdata, type: 'loeysing' }),
  }).then(async (response) => {
    if (response.status === 400) {
      throw new Error((await response.json()).message);
    }
    return responseWithLogErrors(response, response.statusText);
  });

export const fetchStyringsdataKontroll = async (
  styringsdataId: number
): Promise<StyringsdataKontroll> => {
  return await fetchWithErrorHandling(
    `${styringsdataApiBaseUrl}/kontroll/${styringsdataId}`,
    {
      method: 'GET',
    }
  ).then(async (response) => responseWithLogErrors(response, await response.text()));
};

export const updateStyringsdataKontroll = async (
  styringsdata: StyringsdataKontroll
): Promise<StyringsdataKontroll> =>
{
  console.log("Styringsdata", styringsdata);
  return await fetchWithCsrf(`${styringsdataApiBaseUrl}/${styringsdata.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(styringsdata),
  }).then(async (response) =>
    responseWithLogErrors(response, await response.text())
  );
}

export const createStyringsdataKontroll = async (styringsdata: StyringsdataKontroll) => {
  console.log("Styringsdata", styringsdata);
  return await fetchWithCsrf(styringsdataApiBaseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...styringsdata, type: 'kontroll' }),
  }).then(async (response) => {
    if (response.status === 400) {
      throw new Error(await response.text());
    }

    return responseWithLogErrors(response, await response.text());
  });
}
