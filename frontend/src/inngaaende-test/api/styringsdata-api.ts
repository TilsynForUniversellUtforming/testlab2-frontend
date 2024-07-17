import { fetchWrapper } from '@common/form/util';
import { responseToJson } from '@common/util/apiUtils';
import {
  Styringsdata,
  StyringsdataListElement,
} from '@test/styringsdata/types';

const styringsdataApiBaseUrl = '/api/v1/styringsdata';

export const fetchStyringsdata = async (
  styringsdataId: number
): Promise<Styringsdata> => {
  return await fetch(`${styringsdataApiBaseUrl}/${styringsdataId}`, {
    method: 'GET',
  }).then((response) =>
    responseToJson(response, 'Kunne ikkje hente styringsdata')
  );
};

export const fetchStyringsdataListElements = async (
  kontrollId: number
): Promise<StyringsdataListElement[]> => {
  return await fetch(`${styringsdataApiBaseUrl}?kontrollId=${kontrollId}`, {
    method: 'GET',
  }).then((response) =>
    responseToJson(response, 'Kunne ikkje hente liste med styringsdata')
  );
};

export const updateStyringsdata = async (
  styringsdata: Styringsdata
): Promise<Styringsdata> =>
  await fetchWrapper(`${styringsdataApiBaseUrl}/${styringsdata.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(styringsdata),
  }).then((response) =>
    responseToJson(response, 'Kunne ikkje oppdatere styringsdata')
  );

export const createStyringsdata = async (styringsdata: Styringsdata) =>
  await fetchWrapper(styringsdataApiBaseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(styringsdata),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error('Styringsdata finns allereie');
    }
    return responseToJson(response, 'Kunne ikkje opprette styringsdata');
  });
