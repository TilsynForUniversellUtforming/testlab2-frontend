import { responseToJson } from '../../common/util/api/util';
import { AzTestResult } from './types';

const fetchTestResultat = async (url: string): Promise<AzTestResult[]> =>
  await fetch('/api/v1/testing', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: url }),
  }).then((response) => responseToJson(response, 'Kunne ikke hente resultat'));

export default fetchTestResultat;
