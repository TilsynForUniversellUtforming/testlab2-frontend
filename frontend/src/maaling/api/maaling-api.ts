import { getHeader, responseToJson } from '../../common/util/api/util';
import { CreatedMaaling, Maaling, MaalingInit } from './types';

export const createMaaling = async (
  maaling: MaalingInit
): Promise<CreatedMaaling> => {
  const url = await fetch('/api/v1/maalinger', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(maaling),
  }).then((response) =>
    getHeader(response, 'location', 'Kunne ikke lage ny måling')
  );

  return { url: url };
};

export const fetchMaalinger = async (): Promise<Maaling[]> =>
  fetch('/api/v1/maalinger', {
    method: 'GET',
  }).then((response) => responseToJson(response, 'Kunne ikke hente målinger'));
