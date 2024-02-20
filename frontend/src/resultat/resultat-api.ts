import { responseToJson } from '@common/util/apiUtils';
import { TestResult } from '@maaling/api/types';

export const fetchTestresultatAggregert = async (
  id: number
): Promise<TestResult> =>
  fetch(`/api/v1/testresultat/aggregert/${id}`, {}).then((response) =>
    responseToJson(response, 'Kunne ikkje hente for loeysing')
  );

export const getTestresultatAggregert = async (id: number) => {
  fetch(`/api/v1/testresultat/aggregert/${id}`, { method: 'POST' }).then(
    (response) => responseToJson(response, 'Kunne ikkje hente for loeysing')
  );
};
