import StatusDropdown, { StatusDropdownOption } from './StatusDropdown';
import { ElementResultat } from '@test/api/types';
import { TestOverviewElement, TestregelOverviewElement } from '@test/types';

interface Props {
  onChangeStatus: (
    status: ElementResultat,
    testregelId: number,
    sideId: number
  ) => void;
  testoverviewElement: TestregelOverviewElement;
}

const TestregelUtfallDropdown = ({
  onChangeStatus,
  testoverviewElement,
}: Props) => {
  const options: StatusDropdownOption<ElementResultat>[] = [
    {
      label: 'Ikke forekomst',
      value: 'ikkjeForekomst',
      title: 'Sett test til ikke forekomst',
      disabled: testoverviewElement.sideutfall === 'ikkjeForekomst',
    },
    {
      label: 'Samsvar',
      value: 'samsvar',
      title: 'Sett test til samsvar',
      disabled: testoverviewElement.sideutfall === 'samsvar',
    },
    {
      label: 'Ikkje testbart',
      value: 'ikkjeTestbart',
      title: 'Sett test til testbart',
      disabled: testoverviewElement.sideutfall === 'ikkjeTestbart',
    },
  ];

  return (
    <StatusDropdown
      id={`test-utfall-dropdown-${testoverviewElement.testregelId}`}
      options={options}
      onSelect={(value) =>
        onChangeStatus(
          value,
          testoverviewElement.testregelId,
          testoverviewElement.sideutvalId
        )
      }
      buttonLabel={'Sett utfall'}
    />
  );
};

export default TestregelUtfallDropdown;
