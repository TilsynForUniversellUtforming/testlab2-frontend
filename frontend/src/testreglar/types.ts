import { AppContext } from '../common/types';
import { Krav } from '../krav/types';
import { Testregel, TestRegelsett } from './api/types';

export interface TestregelContext extends AppContext {
  error: any;
  loading: boolean;
  testreglar: Testregel[];
  regelsett: TestRegelsett[];
  krav: Krav[];
  setTestregelList: (testRegelList: Testregel[]) => void;
  setRegelsettList: (regelsettList: TestRegelsett[]) => void;
  setContextError: (e: any) => void;
  setLoading: (loading: boolean) => void;
  refresh: () => void;
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
