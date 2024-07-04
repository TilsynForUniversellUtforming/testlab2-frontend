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
