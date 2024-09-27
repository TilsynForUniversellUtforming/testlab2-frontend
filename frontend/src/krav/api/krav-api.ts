import { Krav } from '../types';

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
  const updatedKrav = await fetch(`/api/v1/krav/${krav.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(krav),
  });

  return await updatedKrav.json();
};
