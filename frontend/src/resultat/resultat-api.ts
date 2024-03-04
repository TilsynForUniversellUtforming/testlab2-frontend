import { responseToJson } from '@common/util/apiUtils';
import { AutotesterResult, TestResult } from '@maaling/api/types';

export const fetchTestresultatAggregert = async (
  id: number
): Promise<TestResult> =>
  fetch(`/api/v1/testresultat/aggregert/${id}`, {}).then((response) =>
    responseToJson(response, 'Kunne ikkje hente for loeysing')
  );

export const createTestresultatAggregert = async (id: number) =>
  fetch(`/api/v1/testresultat/aggregert/${id}`, { method: 'POST' }).then(
    (response) => responseToJson(response, 'Kunne ikkje hente for loeysing')
  );

export const fetchDetaljertResultat = async (
  id: number,
  testregelNoekkel: string
): Promise<AutotesterResult[]> => {
  console.log('Fetch detaljertresultat Id ' + id);
  return fetch(
    `/api/v1/testresultat/resultat?sakId=${id}&testregelNoekkel=${testregelNoekkel}`,
    {}
  ).then((response) =>
    responseToJson(response, 'Kunne ikkje hente for loeysing')
  );
};
