import { AppContext } from '@common/types';

import { Regelsett, Testregel } from './api/types';

export interface TestregelContext extends AppContext {
  testreglar: Testregel[];
  regelsett: Regelsett[];
  setTestregelList: (testRegelList: Testregel[]) => void;
  setRegelsettList: (regelsettList: Regelsett[]) => void;
}

export type Evne = {
  value: string;
  label: string;
};

export const evneAlle: Evne = { value: 'Alle  ', label: 'Alle' };

export const evneList: Evne[] = [
  { value: 'Blinde', label: 'Blinde' },
  { value: 'Svaksynte', label: 'Svaksynte' },
  { value: 'Fargeblinde', label: 'Fargeblinde' },
  { value: 'Doove', label: 'Døve' },
  { value: 'Doovblinde', label: 'Døvblinde' },
  { value: 'Tunghooyrde', label: 'Tunghøyrde' },
  { value: 'NedsattKognisjon', label: 'Nedsatt kognisjon' },
  { value: 'NedsattMotorikk', label: 'Nedsatt motorikk' },
  { value: 'Anfall', label: 'Anfall' },
  evneAlle,
];
