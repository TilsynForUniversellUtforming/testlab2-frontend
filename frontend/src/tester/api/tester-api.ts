import { TestResultat } from './types';

const fetchTestResultatLoeysing = async (
  id: number,
  loeysingId: number
): Promise<TestResultat[]> => {
  const response = await fetch(
    `/api/v1/testing/${id}/resultat?loeysingId=${loeysingId}`,
    {
      method: 'GET',
    }
  );

  if (response.ok) {
    return response.json();
  } else {
    const message = await response.text();
    throw Error(message);
  }
};

export default fetchTestResultatLoeysing;
