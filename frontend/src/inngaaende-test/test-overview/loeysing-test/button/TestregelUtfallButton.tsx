import { ButtonStatus } from '@test/types';

import StatusDropdown, { StatusDropdownOption } from './StatusDropdown';
import { ElementResultat } from '@test/api/types';

interface Props {
  onChangeStatus: (status: ElementResultat, testregelId: number) => void;
  testregelId: number;
  status: ButtonStatus;
}

const TestregelUtfallDropdown = ({ onChangeStatus, testregelId }: Props) => {
  const options: StatusDropdownOption<ElementResultat>[] = [
    {
      label: 'Ikke forekomst',
      value: 'ikkjeForekomst',
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
