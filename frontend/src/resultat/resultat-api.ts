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
export const createTestresultatAggregert = async (id: number) =>
  fetchWithCsrf(`/api/v1/testresultat/aggregert/${id}`, {
    method: 'POST',
  }).then(async (response) => responseWithLogErrors(response, (await response.json()).detail));

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
    async (response) => responseWithLogErrors(response, (await response.json()).detail)
  );
};

export async function fetchKontrollResultat(
  idKontroll: number
): Promise<Resultat[]> {
  const response = await fetchWithErrorHandling(
    `/api/v1/testresultat/kontroll/${idKontroll}`,
    {}
  );
  return await responseWithLogErrors(response, (await response.json()).detail);
}

export async function fetchKontrollLoeysing(
  idKontroll: number,
  idLoeysing: number
): Promise<ResultatOversiktLoeysing[]> {
  const response = await fetchWithErrorHandling(
    `/api/v1/testresultat/kontroll/${idKontroll}/loeysing/${idLoeysing}`,
    {}
  );
  return await responseWithLogErrors(response, (await response.json()).detail);
}

export function fetchKrav(kravId: number): Promise<Krav> {
  return fetchWithErrorHandling(`/api/v1/testreglar/krav/${kravId}`, {}).then(
    async (response) => responseWithLogErrors(response, (await response.json()).detail)
  );
}

export async function fetchViolationsData(
  id: number,
  loeysingId: number,
  testregelId: number
): Promise<ViolationsData> {
  const detaljerResultat = fetchDetaljertResultat(id, loeysingId, testregelId);

  const values = await detaljerResultat;
  return {
    detaljerResultat: values,
  };
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

  return await fetchWithErrorHandling(
    `/api/v1/testresultat/tema?` + params.toString(),
    {}
  ).then(async (response) => {
    return responseWithLogErrors(response, (await response.json()).detail);
  });
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
  return await responseWithLogErrors(response, (await response.json()).detail);
}

function keyInEnum(type: KontrollType): string | undefined {
  const enumKey = Object.entries(KontrollType).findLast(
    ([, value]) => value === type
  );
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
