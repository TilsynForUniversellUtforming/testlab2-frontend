import { Krav, KravInit } from '../types';
import { fetchWrapper } from '@common/form/util';

export const listKrav = async (): Promise<Krav[]> => {
  const kravList = await fetch(`/api/v1/krav`, {
    method: 'GET',
  });

  return await kravList.json();
};

export const getKrav = async (id: number): Promise<Krav> => {
  const krav = await fetch(`/api/v1/krav/${id}`, {
    method: 'GET',
  });

  return await krav.json();
};

export const updateKrav = async (krav: Krav): Promise<Krav> => {
  const updatedKrav = await fetchWrapper(`/api/v1/krav/${krav.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(krav),
  });

  return await updatedKrav.json();
};

export const createKrav = async (krav: KravInit): Promise<number> => {
  console.log('createKrav ' + JSON.stringify(krav));
  const nyttKrav = await fetchWrapper(`/api/v1/krav`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(krav),
  });
  const kravid = await nyttKrav.json();
  return Number(JSON.stringify(kravid));
};

export const deleteKrav = async (id: number): Promise<void> => {
  await fetchWrapper(`/api/v1/krav/${id}`, {
    method: 'DELETE',
  });
};
