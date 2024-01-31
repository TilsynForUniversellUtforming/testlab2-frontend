import { responseToJson } from '@common/util/apiUtils';
import { TestResult } from '@maaling/api/types';

export const fetchTestresultatAggregert = async (
  id: number
): Promise<TestResult> =>
  fetch(`/api/v1/testresultat/aggregert/${id}`, {
    method: 'GET',
  }).then((response) =>
    responseToJson(response, 'Kunne ikkje hente for loeysing')
  );
