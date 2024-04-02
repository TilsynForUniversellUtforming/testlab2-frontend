import { Utval } from '@loeysingar/api/types';

import { Kontroll } from './types';

export function fetchKontroll(kontrollId: number): Promise<Response> {
  return fetch(`/api/v1/kontroller/${kontrollId}`);
}

export function updateKontroll(
  kontroll: Kontroll,
  utval: Utval
): Promise<Response> {
  return fetch(`/api/v1/kontroller/${kontroll.id}`, {
    method: 'put',
    body: JSON.stringify({ kontroll, utval }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
