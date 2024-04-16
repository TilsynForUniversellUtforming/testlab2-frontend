import { Utval } from '@loeysingar/api/types';

import { Kontroll, UpdateKontrollTestreglar } from './types';

export function fetchKontroll(kontrollId: number): Promise<Response> {
  return fetch(`/api/v1/kontroller/${kontrollId}`);
}

export function updateKontroll(
  kontroll: Kontroll,
  utval: Utval
): Promise<Response> {
  return fetch(`/api/v1/kontroller/${kontroll.id}`, {
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
  return fetch(`/api/v1/kontroller/${kontroll.id}`, {
    method: 'put',
    body: JSON.stringify({ kontroll, testreglar, kontrollSteg: 'testreglar' }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
