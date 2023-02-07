import { Testregel, TestRegelsett } from './api/types';

export type TestregelContext = {
  error: any;
  loading: boolean;
  testreglar: Testregel[];
  regelsett: TestRegelsett[];
  setTestreglar: (testReglar: Testregel[]) => void;
  setRegelsett: (regelsett: TestRegelsett[]) => void;
  setError: (e: any) => void;
  setLoading: (loading: boolean) => void;
};

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
