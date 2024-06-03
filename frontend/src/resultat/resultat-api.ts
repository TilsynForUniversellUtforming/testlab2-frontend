import { fetchWrapper } from '@common/form/util';
import { responseToJson } from '@common/util/apiUtils';
import { TesterResult, TestResult } from '@maaling/api/types';
import { Resultat, ResultatOversiktLoeysing } from '@resultat/types';

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
  loeysingId: number,
  testregelId: number
): Promise<TesterResult[]> => {
  return fetch(
    `/api/v1/testresultat/kontroll/${id}/${loeysingId}/${testregelId}`,
    {}
  ).then((response) =>
    responseToJson(
      response,
      'Kunne ikkje hente for kontrollId ' + id + ' og testregel ' + testregelId
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

export function fetchKontrollLoeysing(
  idKontroll: number,
  idLoeysing: number
): Promise<ResultatOversiktLoeysing[]> {
  return fetch(
    `/api/v1/testresultat/kontroll/${idKontroll}/${idLoeysing}`,
    {}
  ).then((response) => responseToJson(response, 'Kunne ikkje hente resultat'));
}
