import { fetchWithCsrf, fetchWithErrorHandling } from '@common/form/util';
import { responseWithLogErrors } from '@common/util/apiUtils';
import { TesterResult, TestResult } from '@maaling/api/types';
import {
  Resultat,
  ResultatKrav,
  ResultatOversiktLoeysing,
  ResultatTema,
  ViolationsData,
} from '@resultat/types';

import { KontrollType } from '../kontroll/types';
import { Krav } from '../krav/types';

export const fetchTestresultatAggregert = async (
  id: number
): Promise<TestResult> =>
  fetchWithErrorHandling(`/api/v1/testresultat/aggregert/${id}`, {}).then(
    (response) =>
      responseWithLogErrors(response, 'Kunne ikkje hente for loeysing')
  );

export const createTestresultatAggregert = async (id: number) =>
  fetchWithCsrf(`/api/v1/testresultat/aggregert/${id}`, {
    method: 'POST',
  }).then((response) =>
    responseWithLogErrors(response, 'Kunne ikkje hente for loeysing')
  );

export const fetchDetaljertResultat = async (
  id: number,
  loeysingId: number,
  kravId: number
): Promise<TesterResult[]> => {
  return fetchWithErrorHandling(
    `/api/v1/testresultat/kontroll/${id}/loeysing/${loeysingId}/krav/${kravId}`,
    {}
  ).then((response) =>
    responseWithLogErrors(
      response,
      'Kunne ikkje hente for kontrollId ' + id + ' og krav ' + kravId
    )
  );
};

export const fetchResultList = async (): Promise<Resultat[]> => {
  return fetchWithErrorHandling(`/api/v1/testresultat/list`, {}).then(
    (response) => responseWithLogErrors(response, 'Kunne ikkje hente resultat')
  );
};

export function fetchKontrollResultat(idKontroll: number): Promise<Resultat[]> {
  return fetchWithErrorHandling(
    `/api/v1/testresultat/kontroll/${idKontroll}`,
    {}
  ).then((response) =>
    responseWithLogErrors(response, 'Kunne ikkje hente resultat')
  );
}

export function fetchKontrollLoeysing(
  idKontroll: number,
  idLoeysing: number
): Promise<ResultatOversiktLoeysing[]> {
  return fetchWithErrorHandling(
    `/api/v1/testresultat/kontroll/${idKontroll}/loeysing/${idLoeysing}`,
    {}
  ).then((response) =>
    responseWithLogErrors(response, 'Kunne ikkje hente resultat')
  );
}

export function fetchKrav(kravId: number): Promise<Krav> {
  return fetchWithErrorHandling(`/api/v1/testreglar/krav/${kravId}`, {}).then(
    (response) => responseWithLogErrors(response, 'Kunne ikkje hente krav')
  );
}

export function fetchViolationsData(
  id: number,
  loeysingId: number,
  testregelId: number
): Promise<ViolationsData> {
  const detaljerResultat = fetchDetaljertResultat(id, loeysingId, testregelId);
  const kontrollData = fetchKontrollLoeysing(id, loeysingId);

  return Promise.all([detaljerResultat, kontrollData]).then((values) => {
    return {
      detaljerResultat: values[0],
      kontrollData: values[1],
    };
  });
}

export function fetchResultatPrTema(
  id: string,
  loeysingId: string
): Promise<ResultatTema[]> {
  return fetchResultatPrTemaFilter(
    id,
    undefined,
    undefined,
    undefined,
    loeysingId
  );
}

export function fetchResultatPrKrav(
  id: string,
  loeysingId: string
): Promise<ResultatKrav[]> {
  return fetchResultatPrKravFilter(
    id,
    undefined,
    undefined,
    undefined,
    loeysingId
  );
}

export async function fetchResultatPrTemaFilter(
  kontrollId?: string,
  kontrollType?: KontrollType,
  fraDato?: string,
  tilDato?: string,
  loeysingId?: string
): Promise<ResultatTema[]> {
  const params = resultatTableParams(
    kontrollId,
    kontrollType,
    fraDato,
    tilDato,
    loeysingId
  );

  const response = await fetchWithErrorHandling(
    `/api/v1/testresultat/tema?` + params.toString(),
    {}
  );
  return await responseWithLogErrors(response, 'Kunne ikkje hente resultat');
}

function resultatTableParams(
  kontrollId: string | undefined,
  kontrollType:
    | KontrollType
    | KontrollType.InngaaendeKontroll
    | KontrollType.ForenklaKontroll
    | KontrollType.Tilsyn
    | KontrollType.Statusmaaling
    | KontrollType.UttaleSak
    | KontrollType.Anna
    | undefined,
  fraDato: string | undefined,
  tilDato: string | undefined,
  loeysingId: string | undefined
) {
  const params = new URLSearchParams();

  if (kontrollId) {
    params.append('kontrollId', kontrollId);
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
  if (loeysingId) {
    params.append('loeysingId', loeysingId);
  }
  return params;
}

export async function fetchResultatPrKravFilter(
  kontrollId?: string,
  kontrollType?: KontrollType,
  fraDato?: string,
  tilDato?: string,
  loeysingId?: string
): Promise<ResultatKrav[]> {
  const params = resultatTableParams(
    kontrollId,
    kontrollType,
    fraDato,
    tilDato,
    loeysingId
  );

  const response = await fetchWithErrorHandling(
    `/api/v1/testresultat/krav?` + params.toString(),
    {}
  );
  return await responseWithLogErrors(response, 'Kunne ikkje hente resultat');
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
  fetchWithCsrf(
    `/api/v1/testresultat/rapport/kontroll/${id}/loeysing/${loeysingId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      },
    },
    false
  )
    .then((response) => response.blob())
    .then((blob) => {
      if (blob != null) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tilsynsrapport.docx';
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    });
}

export async function publiserResultat(kontrollId: number) {
  await fetchWithCsrf(
    `/api/v1/testresultat/rapport/publiser/kontroll/${kontrollId}`,
    {
      method: 'PUT',
    }
  );
}
