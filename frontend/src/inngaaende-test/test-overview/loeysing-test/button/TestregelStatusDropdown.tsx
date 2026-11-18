import { ButtonStatus, ManuellTestStatus } from '@test/types';

import StatusDropdown, {
  StatusDropdownOption,
} from './StatusDropdown';

interface Props {
  onChangeStatus: (status: ManuellTestStatus, testregelId: number) => void;
  testregelId: number;
  status: ButtonStatus;
}

const TestregelStatusDropdown = ({
  onChangeStatus,
  testregelId,
  status,
}: Props) => {
  const isStarted = status !== 'ikkje-starta';
  const isFinished =
    status === 'ferdig' || status === 'samsvar' || status === 'ikkje-forekomst';
  const isActive = isStarted && !isFinished;

  const options: StatusDropdownOption<ManuellTestStatus>[] = [
    {
      label: 'Ferdig',
      value: 'ferdig',
      title: isFinishedTitle(isFinished, isStarted),
      disabled: !isActive,
    },
    {
      label: isFinished ? 'Reåpne' : 'Under arbeid',
      value: 'under-arbeid',
      title: isStartedTitle(isActive, isFinished),
      disabled: isActive,
    }
  ];

  return (
    <StatusDropdown
      id={`test-status-dropdown-${testregelId}`}
      options={options}
      onSelect={(value) => onChangeStatus(value, testregelId)}
    />
  );
};

function isFinishedTitle(isFinished: boolean, isStarted: boolean) {
  if (isFinished) {
    return 'Test er ferdig';
  } else if (isStarted) {
    return 'Sett test ferdig';
  }
  return 'Test ikkje starta';
}

function isStartedTitle(isActive: boolean, isFinished: boolean) {
  if (isActive) {
    return 'Allereie under arbeid';
  } else if (isFinished) {
    return 'Reåpne test';
  }
  return 'Sett test under arbeid';
}

export default TestregelStatusDropdown;
