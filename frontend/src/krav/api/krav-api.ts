import { Krav } from '../types';

export const listKrav = async (): Promise<Krav[]> => {
  const kravList = await fetch(`/api/v1/krav`, {
    method: 'GET',
  });

  return await kravList.json();
};
