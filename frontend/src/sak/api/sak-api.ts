import { responseToJson } from '@common/util/apiUtils';
import { EditSak, NySak, Sak, SakListeElement } from '@sak/api/types';

export const getSak = async (id: number): Promise<Sak> => {
  return await fetch(`/api/v1/saker/${id}`, {
    method: 'GET',
  }).then((response) => responseToJson(response, 'Kunne ikke hente sak'));
};

export const createSak = async (nySak: NySak): Promise<number> =>
  await fetch(`/api/v1/saker`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(nySak),
  }).then((response) => responseToJson(response, 'Kunne ikkje lage nytt sak'));

export const updateSak = async (sakId: number, sak: EditSak): Promise<Sak> =>
  await fetch(`/api/v1/saker/${sakId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sak),
  }).then((response) =>
    responseToJson(response, 'Kunne ikkje oppdatere saker')
  );

export async function fetchAlleSaker(): Promise<Array<SakListeElement>> {
  const r = await fetch('/api/v1/saker');
  return await r.json();
}
