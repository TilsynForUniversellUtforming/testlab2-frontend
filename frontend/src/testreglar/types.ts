import { AppContext } from '@common/types';
import { Krav } from 'krav/types';

import {
  InnhaldstypeTesting,
  Regelsett,
  Tema,
  Testobjekt,
  TestregelBase,
} from './api/types';

export interface TestregelContext extends AppContext {
  testregelList: TestregelBase[];
  regelsettList: Regelsett[];
  setTestregelList: (testRegelList: TestregelBase[]) => void;
  setRegelsettList: (regelsettList: Regelsett[]) => void;
  innhaldstypeList: InnhaldstypeTesting[];
  temaList: Tema[];
  testobjektList: Testobjekt[];
  kravList: Krav[];
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
