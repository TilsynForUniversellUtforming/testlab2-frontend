import { MaalingResponse, TestInputParameters } from '../types';
import { TestResponse, TestResult } from './types';

export const createMaaling = async (
  url: TestInputParameters
): Promise<string | null> => {
  const data = await fetch('/api/v1/maalinger', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(url),
  });

  return data.headers.get('location');
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
    body: JSON.stringify({ maalingId: maalingData.id }),
  });

  const json: TestResponse = await data.json();

  return json.output;
};

// export const fetchTestResultat_dummy = async (): Promise<TestResult[]> => {
//   console.log('FETCHING DUMMY');
//
//   return JSON.parse(dummy_response);
// };

export default fetchTestResultat;
