import { Loeysing } from '@loeysingar/api/types';

import { Verksemd } from './types';

const verksemdList_dummy_response = [
  {
    id: 1,
    namn: 'Testverksemd',
    organisasjonsnummer: '123456789',
  },
];

const verksemdLoeysingRelation_dummy_response: Loeysing[] = [
  {
    id: 2,
    namn: 'digdir.no',
    url: 'https://www.digdir.no/',
    orgnummer: '991825827',
  },
  {
    id: 4,
    namn: 'Demoside',
    url: 'https://www.tutorialspoint.com/',
    orgnummer: '000000000',
  },
];

const getVerksemdList_dummy = async (): Promise<Verksemd[]> => {
  return verksemdList_dummy_response;
};

export const getVerksemdLoeysingRelations_dummy = async (
  verksemd: Loeysing
): Promise<Loeysing[]> => {
  if (verksemd.id === 1) {
    return verksemdLoeysingRelation_dummy_response;
  } else {
    return [];
  }
};

export default getVerksemdList_dummy;
