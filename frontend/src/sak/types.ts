import { AppRoute } from '../common/appRoutes';
import { AppContext } from '../common/types';
import { Loeysing } from '../loeysingar/api/types';
import { Maaling } from '../maaling/api/types';
import { TestRegelsett } from '../testreglar/api/types';

export interface SakContext extends AppContext {
  regelsettList: TestRegelsett[];
  loeysingList: Loeysing[];
  // TODO - Bytt ut med sak
  maaling?: Maaling;
  // TODO - Bytt ut med setSak
  setMaaling: (maaling: Maaling) => void;
  setLoading: (loading: boolean) => void;
}

export type SakFormState = {
  navn?: string;
  loeysingList: Loeysing[];
  regelsett?: TestRegelsett;
  currentStep?: AppRoute;
};

export type SakStepType = 'Init' | 'Loeysing' | 'Testregel' | 'Confirm';

export type SakStep = {
  index: number;
  heading: string;
  subHeading?: string;
  stepperTitle: string;
  stepperSubTitle: string;
  icon: string;
  sakStepType: SakStepType;
};

export const sakSteps: SakStep[] = [
  {
    index: 0,
    heading: 'La oss opprette en sak',
    subHeading: 'Fortell oss litt om saken du vil opprette',
    stepperTitle: 'Saken',
    stepperSubTitle: 'Om saken',
    sakStepType: 'Init',
    icon: '✎',
  },
  {
    index: 1,
    heading: 'Vel løysingar',
    subHeading: 'Vel kva løysingar du vil bruka i saken',
    stepperTitle: 'Løysingar',
    stepperSubTitle: 'Utval nettløysingar',
    sakStepType: 'Loeysing',
    icon: '@',
  },
  {
    index: 2,
    heading: 'Vel Regelsett',
    subHeading: 'Vel kva testregel du vil bruka i saken',
    stepperTitle: 'Testreglar',
    stepperSubTitle: 'Krav og testing',
    sakStepType: 'Testregel',
    icon: '§',
  },
  {
    index: 3,
    heading: 'Oppsummering',
    stepperTitle: 'Oppsummert',
    stepperSubTitle: '',
    sakStepType: 'Confirm',
    icon: '∑',
  },
];

export interface SakFormBaseProps {
  heading: string;
  subHeading?: string;
  maalingFormState: SakFormState;
  onSubmit: (maalingFormState: SakFormState) => void;
}
