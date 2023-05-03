import { AppRoute } from '../common/appRoutes';
import { AppContext } from '../common/types';
import { Loeysing } from '../loeysingar/api/types';
import { Maaling } from '../maaling/api/types';
import { TestRegelsett } from '../testreglar/api/types';
import { FormStepState } from './hooks/useSakForm';

export interface SakContext extends AppContext {
  regelsettList: TestRegelsett[];
  loeysingList: Loeysing[];
  maaling?: Maaling;
  setMaaling: (maaling: Maaling) => void;
  setContextLoading: (loading: boolean) => void;
}

export type SakFormState = {
  navn?: string;
  loeysingList: Loeysing[];
  regelsettId?: string;
  maxLinksPerPage: number;
  numLinksToSelect: number;
  sakType?: Saktype;
  advisor?: string;
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
  heading: 'La oss opprette en sak',
  subHeading: 'Fortell oss litt om saken du vil opprette',
  stepperTitle: 'Saken',
  stepperSubTitle: 'Om saka',
  sakStepType: 'Init',
};

const loeysingStep: SakStepBase = {
  heading: 'Vel løysingar',
  subHeading: 'Vel kva løysingar du vil bruka i saken',
  stepperTitle: 'Løysingar',
  stepperSubTitle: 'Utval nettløysingar',
  sakStepType: 'Loeysing',
};

const regelsettStep: SakStepBase = {
  heading: 'Vel Regelsett',
  subHeading: 'Vel kva testregel du vil bruka i saken',
  stepperTitle: 'Testreglar',
  stepperSubTitle: 'Krav og testing',
  sakStepType: 'Testregel',
};

const summaryStep: SakStepBase = {
  heading: 'Oppsummering',
  stepperTitle: 'Oppsummert',
  stepperSubTitle: '',
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
