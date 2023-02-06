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
