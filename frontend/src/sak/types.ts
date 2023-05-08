import { AppRoute } from '../common/appRoutes';
import { AppContext } from '../common/types';
import { Loeysing } from '../loeysingar/api/types';
import { Maaling } from '../maaling/api/types';
import { Testregel, TestRegelsett } from '../testreglar/api/types';
import { User } from '../user/api/types';
import { FormStepState } from './hooks/useSakForm';

export type LoeysingVerksemd = {
  loeysing: Loeysing;
  verksemd: Loeysing;
};

export interface SakContext extends AppContext {
  regelsettList: TestRegelsett[];
  loeysingList: Loeysing[];
  advisors: User[];
  maaling?: Maaling;
  setMaaling: (maaling: Maaling) => void;
  setContextLoading: (loading: boolean) => void;
}

export type SakFormState = {
  navn?: string;
  loeysingList: LoeysingVerksemd[];
  regelsettId?: string;
  testregelList: Testregel[];
  maxLinksPerPage: number;
  numLinksToSelect: number;
  sakType?: Saktype;
  advisor?: User;
  sakNumber?: string;
  currentStep?: AppRoute;
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
  maalingFormState: SakFormState;
  onSubmit: (maalingFormState: SakFormState) => void;
}

export type Saktype =
  | 'Dispensasjonssøknad'
  | 'IKT-fagleg uttale'
  | 'Forenklet kontroll'
  | 'Statusmåling'
  | 'Tilsyn'
  | 'Anna';
