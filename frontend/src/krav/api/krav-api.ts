import { Krav } from '../types';

export const listKrav = async (): Promise<Krav[]> => {
  const kravList = await fetch(`http://localhost:5173/api/v1/krav`, {
    method: 'GET',
  });

  return await kravList.json();
};
