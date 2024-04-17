import { fetchWrapper } from '@common/form/util';
import { responseToJson } from '@common/util/apiUtils';
import { TesterResult, TestResult } from '@maaling/api/types';

export const fetchTestresultatAggregert = async (
  id: number
): Promise<TestResult> =>
  fetch(`/api/v1/testresultat/aggregert/${id}`, {}).then((response) =>
    responseToJson(response, 'Kunne ikkje hente for loeysing')
  );

export const createTestresultatAggregert = async (id: number) =>
  fetchWrapper(`/api/v1/testresultat/aggregert/${id}`, { method: 'POST' }).then(
    (response) => responseToJson(response, 'Kunne ikkje hente for loeysing')
  );

export const fetchDetaljertResultat = async (
  id: number,
  testregelNoekkel: string,
  loeysingId: number
): Promise<TesterResult[]> => {
  return fetch(
    `/api/v1/testresultat/resultat?sakId=${id}&testregelNoekkel=${testregelNoekkel}&loeysingId=${loeysingId}`,
    {}
  ).then((response) =>
    responseToJson(
      response,
      'Kunne ikkje hente for sakId ' + id + ' og testregel ' + testregelNoekkel
    )
  );
};
