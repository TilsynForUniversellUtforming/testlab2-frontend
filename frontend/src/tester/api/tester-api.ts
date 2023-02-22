import { getHeader, responseToJson } from '../../common/util/api/util';
import {
  Loeysing,
  MaalingInit,
  MaalingResponse,
  TestInputParameters,
  TestResponse,
  TestResult,
} from './types';

export const createMaaling = async (
  maaling: MaalingInit
): Promise<MaalingResponse> => {
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

const fetchTestResultat = async (
  url: TestInputParameters
): Promise<TestResult[]> => {
  const maaling = await fetch(`/api${url.url}`, {
    method: 'GET',
  });

  const maalingData: MaalingResponse = await maaling.json();

  const data = await fetch('/api/v1/tester', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ maalingId: 1 }),
  });

  const json: TestResponse = await data.json();

  return json.output;
};

export const fetchLoysingar = async (): Promise<Loeysing[]> =>
  await fetch(`/api/v1/maalinger/loeysingar`, {
    method: 'GET',
  }).then((response) => responseToJson(response, 'Kunne ikke hente løsninger'));

export default fetchTestResultat;
