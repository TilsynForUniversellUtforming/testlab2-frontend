import { Verksemd } from './types';

const dummyResponse = [
  {
    id: 1,
    namn: 'Testverksemd',
    organisasjonsnummer: '123456789',
  },
];

const getVerksemdList_dummy = async (): Promise<Verksemd[]> => {
  return dummyResponse;
};

export default getVerksemdList_dummy;
