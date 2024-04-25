import { fetchWrapper } from '@common/form/util';
import { Utval } from '@loeysingar/api/types';

import { Kontroll, UpdateKontrollSideutval, UpdateKontrollTestreglar } from './types';

export function fetchKontroll(kontrollId: number): Promise<Response> {
  return fetch(`/api/v1/kontroller/${kontrollId}`);
}

export function updateKontroll(
  kontroll: Kontroll,
  utval: Utval
): Promise<Response> {
  return fetchWrapper(`/api/v1/kontroller/${kontroll.id}`, {
    method: 'put',
    body: JSON.stringify({
      kontroll,
      utvalId: utval.id,
      kontrollSteg: 'utval',
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function updateKontrollTestreglar(
  kontroll: Kontroll,
  testreglar: UpdateKontrollTestreglar
): Promise<Response> {
  return fetchWrapper(`/api/v1/kontroller/${kontroll.id}`, {
    method: 'put',
    body: JSON.stringify({ kontroll, testreglar, kontrollSteg: 'testreglar' }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function updateKontrollSideutval(
  kontroll: Kontroll,
  sideutval: UpdateKontrollSideutval
): Promise<Response> {
  return fetchWrapper(`/api/v1/kontroller/${kontroll.id}`, {
    method: 'put',
    body: JSON.stringify({ kontroll, sideutval, kontrollSteg: 'sideutval' }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
