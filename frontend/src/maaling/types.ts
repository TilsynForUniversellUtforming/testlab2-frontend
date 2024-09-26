import { AppContext, Severity } from '@common/types';
import { Loeysing, Utval } from '@loeysingar/api/types';
import { FormStepState } from '@maaling/hooks/hooks/useMaalingForm';
import { Regelsett, TestregelBase } from '@testreglar/api/types';
import { Verksemd } from '@verksemder/api/types';

import { User } from '../user/api/types';
import { Maaling } from './api/types';

export interface MaalingContext extends AppContext {
  refreshMaaling: () => void;
  maalingList: Maaling[];
  setMaalingList: (maalingList: Maaling[]) => void;
  maaling?: Maaling;
  setMaaling: (maaling: Maaling) => void;
  loeysingList: Loeysing[];
  verksemdList: Verksemd[];
  testregelList: TestregelBase[];
  regelsettList: Regelsett[];
  utvalList: Utval[];
  advisors: User[];
  handleStartCrawling: (maaling: Maaling) => void;
  handleStartTest: (maaling: Maaling) => void;
  handleStartPublish: (maaling: Maaling) => void;
  testStatus: MaalingTestStatus;
  clearTestStatus: () => void;
  loadingMaaling: boolean;
}

export type CrawlUrl = {
  url: string;
};

export type MaalingTestStatus = {
  loading: boolean;
  message?: string;
  severity?: Severity;
};

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

export type LoeysingNettsideRelation = {
  loeysing: Loeysing;
  properties: NettsideProperties[];
};

export type LoeysingNettsideRelationTest = {
  useInTest: boolean;
} & LoeysingNettsideRelation;

export type SakVerksemdLoeysingRelation = {
  verksemd?: Loeysing;
  manualVerksemd?: VerksemdInit;
  loeysingList: LoeysingNettsideRelationTest[];
};

export type NettsideProperties = {
  type?: string;
  url?: string;
  reason?: string;
  description?: string;
  id?: number;
};

export type LoeysingSource = 'utval' | 'manuell';

export interface SakContext extends AppContext {
  regelsettList: Regelsett[];
  testregelList: TestregelBase[];
  loeysingList: Loeysing[];
  utvalList: Utval[];
  verksemdList: Verksemd[];
  advisors: User[];
  setContextLoading: (loading: boolean) => void;
  refreshLoeysing: () => void;
}

export type MaalingFormState = {
  navn: string;
  sakType?: Saktype;
  advisorId?: string;
  sakNumber?: string;
  maxLenker: number;
  talLenker: number;
  loeysingSource: LoeysingSource;
  loeysingList: LoeysingVerksemd[];
  utval?: Utval;
  testregelList: TestregelBase[];
  // Ny
  verksemdLoeysingRelation?: SakVerksemdLoeysingRelation;
  sakId?: number;
  frist?: string; // t.d. 2024-01-01
};

export const defaultSakFormState: MaalingFormState = {
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
  sakId: undefined,
  frist: undefined,
};
export type StepType = 'Init' | 'Loeysing' | 'Testregel' | 'Confirm';

export type StepBase = {
  heading: string;
  subHeading?: string;
  stepperTitle: string;
  stepperSubTitle: string;
  sakStepType: StepType;
};

export type MaalingStep = {
  index: number;
  heading: string;
  description?: string;
  stepperTitle: string;
  stepperSubTitle: string;
  sakStepType: StepType;
};

const initStep: StepBase = {
  heading: 'La oss opprette ei sak',
  subHeading: 'Fortell oss litt om saka du vil opprette.',
  stepperTitle: 'Saka',
  stepperSubTitle: 'Om saka',
  sakStepType: 'Init',
};

const loeysingStep: StepBase = {
  heading: 'La oss legge til løysingar',
  subHeading: 'Vel aktuelle løysingar og kven som har ansvar for dei i saka.',
  stepperTitle: 'Løysingar',
  stepperSubTitle: 'Utval nettløysingar',
  sakStepType: 'Loeysing',
};

const regelsettStep: StepBase = {
  heading: 'La oss legge til testreglar',
  subHeading: 'Vel aktuelle testreglar.',
  stepperTitle: 'Testreglar',
  stepperSubTitle: 'Krav og testing',
  sakStepType: 'Testregel',
};

const summaryStep: StepBase = {
  heading: 'Oppsummering',
  subHeading: 'Sjå over at alt er på plass.',
  stepperTitle: 'Oppsummering',
  stepperSubTitle: 'Sjå over og opprett',
  sakStepType: 'Confirm',
};

export const defaultSakSteps: MaalingStep[] = [
  { ...initStep, index: 0 },
  { ...loeysingStep, index: 1 },
  { ...regelsettStep, index: 2 },
  { ...summaryStep, index: 3 },
];

export const startedSakSteps = [
  { ...initStep, index: 0 },
  { ...summaryStep, index: 1 },
];

export interface FormBaseProps {
  formStepState: FormStepState;
  maalingFormState: MaalingFormState;
  onSubmit: (formState: MaalingFormState) => void;
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

export const maalingTypeOptions = [saktypeForenklet];
