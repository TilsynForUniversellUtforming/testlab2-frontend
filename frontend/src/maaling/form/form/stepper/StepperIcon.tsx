import { StepType } from '@maaling/types';
import {
  EarthIcon,
  FileTextIcon,
  TasklistIcon,
  WrenchIcon,
} from '@navikt/aksel-icons';

const StepperIcon = ({ maalingStepType }: { maalingStepType: StepType }) => {
  switch (maalingStepType) {
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
