import { AppContext } from '@common/types';
import { Loeysing, Utval } from '@loeysingar/api/types';
import { Maaling } from '@maaling/api/types';
import { Testregel, TestRegelsett } from '@testreglar/api/types';
import { Verksemd } from '@verksemder/api/types';

import { User } from '../user/api/types';
import { FormStepState } from './hooks/useSakForm';

export type LoeysingVerksemd = {
  loeysing: Loeysing;
  verksemd: Verksemd;
};

export type VerksemdInit = {
  namn?: string;
  orgnummer?: string;
  ceo?: string;
  contactPerson?: string;
};

export type SakVerksemdLoeysingRelation = {
  verksemd?: Loeysing;
  manualVerksemd?: VerksemdInit;
  loeysingList: Loeysing[]; // TODO - Fix
};

export type NettsideProperties = {
  url: string;
  description: string;
};

export type LoeysingNettsideRelation = {
  loeysing: Loeysing;
  forside?: NettsideProperties;
  navigasjonsmeny?: NettsideProperties;
  bilder?: NettsideProperties;
  overskrifter?: NettsideProperties;
  artikkel?: NettsideProperties;
  skjema?: NettsideProperties;
  tabell?: NettsideProperties;
  knapper?: NettsideProperties;
};

export type LoeysingSource = 'utval' | 'manuell';

export interface SakContext extends AppContext {
  regelsettList: TestRegelsett[];
  loeysingList: Loeysing[];
  utvalList: Utval[];
  verksemdList: Verksemd[];
  advisors: User[];
  maaling?: Maaling;
  setMaaling: (maaling: Maaling) => void;
  setContextLoading: (loading: boolean) => void;
  refreshLoeysing: () => void;
}

export type SakFormState = {
  navn: string;
  sakType?: Saktype;
  advisorId?: string;
  sakNumber?: string;
  maxLenker: number;
  talLenker: number;
  loeysingSource: LoeysingSource;
  loeysingList: LoeysingVerksemd[];
  utval?: Utval;
  testregelList: Testregel[];
  // Ny
  verksemdLoeysingRelation?: SakVerksemdLoeysingRelation;
};

export const defaultSakFormState: SakFormState = {
  navn: '',
  loeysingList: [],
  testregelList: [],
  maxLenker: 100,
  talLenker: 30,
  sakType: undefined,
  advisorId: undefined,
  sakNumber: '',
  loeysingSource: 'utval',
  // Ny
  verksemdLoeysingRelation: {
    verksemd: undefined,
    manualVerksemd: {
      namn: '',
      orgnummer: '',
      ceo: '',
      contactPerson: '',
    },
    loeysingList: [],
  },
};

export type SakStepType = 'Init' | 'Loeysing' | 'Testregel' | 'Confirm';

export type SakStepBase = {
  heading: string;
  subHeading?: string;
  stepperTitle: string;
  stepperSubTitle: string;
  sakStepType: SakStepType;
};

export type SakStep = {
  index: number;
  heading: string;
  subHeading?: string;
  stepperTitle: string;
  stepperSubTitle: string;
  sakStepType: SakStepType;
};

const initStep: SakStepBase = {
  heading: 'La oss opprette ei sak',
  subHeading: 'Fortell oss litt om saka du vil opprette.',
  stepperTitle: 'Saka',
  stepperSubTitle: 'Om saka',
  sakStepType: 'Init',
};

const loeysingStep: SakStepBase = {
  heading: 'La oss legge til løysingar',
  subHeading: 'Vel aktuelle løysingar og kven som har ansvar for dei i saka.',
  stepperTitle: 'Løysingar',
  stepperSubTitle: 'Utval nettløysingar',
  sakStepType: 'Loeysing',
};

const regelsettStep: SakStepBase = {
  heading: 'La oss legge til testreglar',
  subHeading: 'Vel aktuelle testreglar.',
  stepperTitle: 'Testreglar',
  stepperSubTitle: 'Krav og testing',
  sakStepType: 'Testregel',
};

const summaryStep: SakStepBase = {
  heading: 'Oppsummering',
  subHeading: 'Sjå over at alt er på plass.',
  stepperTitle: 'Oppsummering',
  stepperSubTitle: 'Sjå over og opprett',
  sakStepType: 'Confirm',
};

export const defaultSakSteps: SakStep[] = [
  { ...initStep, index: 0 },
  { ...loeysingStep, index: 1 },
  { ...regelsettStep, index: 2 },
  { ...summaryStep, index: 3 },
];

export const startedSakSteps = [
  { ...initStep, index: 0 },
  { ...summaryStep, index: 1 },
];

export interface SakFormBaseProps {
  formStepState: FormStepState;
  sakFormState: SakFormState;
  onSubmit: (maalingFormState: SakFormState) => void;
}

export type Saktype =
  | 'Forenklet kontroll'
  | 'Inngående kontroll'
  | 'Retest'
  | 'Tilsyn';

export const saktypeForenklet = {
  label: 'Forenklet kontroll',
  value: 'Forenklet kontroll',
};

export const saktypeOptions = [
  saktypeForenklet,
  { label: 'Inngående kontroll', value: 'Inngående kontroll' },
  { label: 'Retest', value: 'Retest' },
  { label: 'Tilsyn', value: 'Tilsyn' },
];
