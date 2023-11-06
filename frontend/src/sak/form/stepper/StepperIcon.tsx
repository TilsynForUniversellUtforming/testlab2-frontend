import {
  EarthIcon,
  FileTextIcon,
  TasklistIcon,
  WrenchIcon,
} from '@navikt/aksel-icons';
import { SakStepType } from '@sak/types';

const StepperIcon = ({ sakStepType }: { sakStepType: SakStepType }) => {
  switch (sakStepType) {
    case 'Init':
      return <FileTextIcon fontSize="2rem" />;
    case 'Loeysing':
      return <EarthIcon fontSize="2rem" />;
    case 'Testregel':
      return <WrenchIcon fontSize="2rem" />;
    case 'Confirm':
      return <TasklistIcon fontSize="2rem" />;
  }
};

export default StepperIcon;
