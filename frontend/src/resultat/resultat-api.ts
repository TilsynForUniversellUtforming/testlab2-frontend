import { fetchWrapper } from '@common/form/util';
import { responseToJson } from '@common/util/apiUtils';
import { TesterResult, TestResult } from '@maaling/api/types';
import {
  Resultat,
  ResultatOversiktLoeysing,
  ResultatTema,
  ViolationsData,
} from '@resultat/types';

import { KontrollType } from '../kontroll/types';
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

export function fetchResultatPrTema(): Promise<ResultatTema[]> {
  return fetchResultatPrTemaFilter(undefined, undefined, undefined, undefined);
}

export async function fetchResultatPrTemaFilter(
  kontrollId?: number,
  kontrollType?: KontrollType,
  fraDato?: string,
  tilDato?: string
): Promise<ResultatTema[]> {
  const params = new URLSearchParams();

  if (kontrollId) {
    params.append('kontrollId', String(kontrollId));
  }
  if (kontrollType && keyInEnum(kontrollType)) {
    params.append('kontrollType', <string>keyInEnum(kontrollType));
  }
  if (fraDato) {
    params.append('fraDato', fraDato);
  }
  if (tilDato) {
    params.append('tilDato', tilDato);
  }

  const response = await fetch(
    `/api/v1/testresultat/tema?` + params.toString(),
    {}
  );
  return await responseToJson(response, 'Kunne ikkje hente resultat');
}

function keyInEnum(type: KontrollType): string | undefined {
  const enumKey = Object.entries(KontrollType)
    .filter(([, value]) => value === type)
    .pop();
  if (enumKey) {
    return enumKey[0];
  }
}

export function genererWordRapport(id: number, loeysingId: number) {
  fetchWrapper(
    `/api/v1/testresultat/rapport/kontroll/${id}/loeysing/${loeysingId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      },
    },
    false
  ).then((response) => response.body);
}
