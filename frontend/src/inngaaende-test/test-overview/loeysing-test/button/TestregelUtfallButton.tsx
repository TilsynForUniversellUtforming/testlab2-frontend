import { ButtonStatus, ManuellTestStatus } from '@test/types';

import StatusDropdown, { StatusDropdownOption } from './StatusDropdown';

interface Props {
  onChangeStatus: (status: ManuellTestStatus, testregelId: number) => void;
  testregelId: number;
  status: ButtonStatus;
}

const TestregelUtfallDropdown = ({
  onChangeStatus,
  testregelId,
  status,
}: Props) => {
  const options: StatusDropdownOption[] = [
    {
      label: 'Ikke forekomst',
      value: 'ikkje-forekomst',
      title: 'Sett test til ikke forekomst',
    },
    {
      label: 'Samsvar',
      value: 'samsvar',
      title: 'Sett test til samsvar',
    },
  ];

  return (
    <StatusDropdown
      id={`test-status-dropdown-${testregelId}`}
      options={options}
      onSelect={(value) => onChangeStatus(value, testregelId)}
      buttonLabel={'Sett utfall'}
    />
  );
};

export default TestregelUtfallDropdown;
