import { RegelsettRequest, Testregel, TestRegelsett } from './types';

export const listTestreglar = async (): Promise<Testregel[]> => {
  const testreglar = await fetch(`http://localhost:5173/api/v1/testreglar`, {
    method: 'GET',
  });

  return await testreglar.json();
};

export const listRegelsett = async (): Promise<TestRegelsett[]> => {
  const regelsett = await fetch(
    `http://localhost:5173/api/v1/testreglar/regelsett`,
    {
      method: 'GET',
    }
  );

  return await regelsett.json();
};

// export const createTestregel = async (testregel: Testregel): Promise<Testregel[]> => {
// }

export const createRegelsett = async (
  regelsett: RegelsettRequest
): Promise<TestRegelsett[]> => {
  return await fetch(`http://localhost:5173/api/v1/testreglar/regelsett`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(regelsett),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Kunne ikke lage nytt regelsett');
    }
  });
};

// export const updateTestregel = async () => {};
// export const updateRegelsett = async () => {};
export const deleteTestregel = async (id: number): Promise<Testregel[]> => {
  const testreglar = await fetch(
    `http://localhost:5173/api/v1/testreglar/${id}`,
    {
      method: 'DELETE',
    }
  );

  return await testreglar.json();
};

export const deleteRegelsett = async (id: number) => {
  const testreglar = await fetch(
    `http://localhost:5173/api/v1/testreglar/regelsett/${id}`,
    {
      method: 'DELETE',
    }
  );

  return await testreglar.json();
};
