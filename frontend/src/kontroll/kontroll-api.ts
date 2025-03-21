import { fetchWithCsrf, fetchWithErrorHandling } from '@common/form/util';
import { responseWithLogErrors } from '@common/util/apiUtils';
import { Utval } from '@loeysingar/api/types';

import { SideutvalBase, SideutvalType } from './sideutval/types';
import { Kontroll, KontrollListItem, UpdateKontrollTestreglar } from './types';

export function fetchKontroll(kontrollId: number): Promise<Response> {
  return fetchWithErrorHandling(`/api/v1/kontroller/${kontrollId}`);
}

export function fetchTestStatus(kontrollId: number): Promise<Response> {
  return fetchWithErrorHandling(`/api/v1/kontroller/test-status/${kontrollId}`);
}

export function editKontroll(kontroll: Kontroll): Promise<Response> {
  return fetchWithCsrf(`/api/v1/kontroller/${kontroll.id}`, {
    method: 'put',
    body: JSON.stringify({
      kontroll,
      kontrollSteg: 'edit',
    }),
  });
}

export function updateKontrollUtval(
  kontroll: Kontroll,
  utval: Utval
): Promise<Response> {
  return fetchWithCsrf(`/api/v1/kontroller/${kontroll.id}`, {
    method: 'put',
    body: JSON.stringify({
      kontroll,
      utvalId: utval.id,
      kontrollSteg: 'utval',
    }),
  });
}

export function updateKontrollTestreglar(
  kontroll: Kontroll,
  testreglar: UpdateKontrollTestreglar
): Promise<Response> {
  return fetchWithCsrf(`/api/v1/kontroller/${kontroll.id}`, {
    method: 'put',
    body: JSON.stringify({ kontroll, testreglar, kontrollSteg: 'testreglar' }),
  });
}

export function updateKontrollSideutval(
  kontroll: Kontroll,
  sideutvalList: SideutvalBase[]
): Promise<Response> {
  return fetchWithCsrf(`/api/v1/kontroller/${kontroll.id}`, {
    method: 'put',
    body: JSON.stringify({
      kontroll,
      sideutvalList,
      kontrollSteg: 'sideutval',
    }),
  });
}

export async function listSideutvalType(): Promise<SideutvalType[]> {
  return await fetchWithErrorHandling(`/api/v1/kontroller/sideutvaltype`, {
    method: 'GET',
  }).then((response) =>
    responseWithLogErrors(response, 'Kunne ikkje hente testregel')
  );
}

export async function fetchAlleKontroller(): Promise<KontrollListItem[]> {
  const res = await fetchWithErrorHandling('/api/v1/kontroller');
  if (res.status > 399) {
    throw new Response('Feilet da vi prøvde å hente alle kontroller', {
      statusText: res.statusText,
    });
  }
  return res.json();
}
