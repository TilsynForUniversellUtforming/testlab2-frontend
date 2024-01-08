import { responseToJson } from '@common/util/apiUtils';

import { ManualTestResult } from '../types';

export const getManuellKontrollResults = async (
  sakId: number
): Promise<ManualTestResult[]> => {
  return await fetch(`/api/v1/testing/manuell/${sakId}`, {
    method: 'GET',
  }).then((response) => responseToJson(response, 'Kunne ikke hente sak'));
};
