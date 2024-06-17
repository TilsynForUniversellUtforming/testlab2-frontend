import { fetchWrapper } from '@common/form/util';
import { responseToJson } from '@common/util/apiUtils';
import { TesterResult, TestResult } from '@maaling/api/types';
import {
  Resultat,
  ResultatOversiktLoeysing,
  ViolationsData,
} from '@resultat/types';

import { Krav } from '../krav/types';

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
  kravId: number
): Promise<TesterResult[]> => {
  return fetch(
    `/api/v1/testresultat/kontroll/${id}/loeysing/${loeysingId}/krav/${kravId}`,
    {}
  ).then((response) =>
    responseToJson(
      response,
      'Kunne ikkje hente for kontrollId ' + id + ' og krav ' + kravId
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
    `/api/v1/testresultat/kontroll/${idKontroll}/loeysing/${idLoeysing}`,
    {}
  ).then((response) => responseToJson(response, 'Kunne ikkje hente resultat'));
}

export function fetchKrav(kravId: number): Promise<Krav> {
  return fetch(`/api/v1/testreglar/krav/${kravId}`, {}).then((response) =>
    responseToJson(response, 'Kunne ikkje hente krav')
  );
}

export function fetchViolationsData(
  id: number,
  loeysingId: number,
  kravId: number
): Promise<ViolationsData> {
  const detaljerResultat = fetchDetaljertResultat(id, loeysingId, kravId);
  const kontrollData = fetchKontrollLoeysing(id, loeysingId);
  const krav = fetchKrav(kravId);

  return Promise.all([detaljerResultat, kontrollData, krav]).then((values) => {
    return {
      detaljerResultat: values[0],
      kontrollData: values[1],
      krav: values[2],
    };
  });
}
