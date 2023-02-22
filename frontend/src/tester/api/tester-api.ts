import { TestInputParameters, TestResponse, TestResult } from './types';

const fetchTestResultat = async (
  url: TestInputParameters
): Promise<TestResult[]> => {
  const maaling = await fetch(`/api${url.url}`, {
    method: 'GET',
  });

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

export default fetchTestResultat;
