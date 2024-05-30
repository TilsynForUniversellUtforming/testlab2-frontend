import { fetchWrapper } from '@common/form/util';
import { responseToJson } from '@common/util/apiUtils';
import { TesterResult, TestResult } from '@maaling/api/types';
import { Resultat } from '@resultat/types';

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
  const params = new URLSearchParams();
  params.append('sakId', id.toString());
  params.append('testregelNoekkel', testregelNoekkel);
  params.append('loeysingId', loeysingId.toString());
  return fetch(`/api/v1/testresultat/resultat?${params.toString()}`, {}).then(
    (response) =>
      responseToJson(
        response,
        'Kunne ikkje hente for sakId ' +
          id +
          ' og testregel ' +
          testregelNoekkel
      )
  );
};

export const fetchResultList = async (): Promise<Resultat[]> => {
  return fetch(`/api/v1/testresultat/list`, {}).then((response) =>
    responseToJson(response, 'Kunne ikkje hente resultat')
  );
};

export function fetchKontrollResultat(idKontroll: number): Promise<Resultat[]> {
  return fetch(`/api/v1/testresultat/kontroll/${idKontroll}`, {}).then(
    (response) => responseToJson(response, 'Kunne ikkje hente resultat')
  );
}
