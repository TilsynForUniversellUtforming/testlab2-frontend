import { ButtonVariant } from '@common/types';
import { DropdownMenu } from '@digdir/design-system-react';
import { CogIcon } from '@navikt/aksel-icons';
import { ButtonStatus, ManuellTestStatus } from '@test/types';
import { useState } from 'react';

interface Props {
  onChangeStatus: (status: ManuellTestStatus, testregelId: number) => void;
  testregelId: number;
  status: ButtonStatus;
}

type StatusOption = {
  label: string;
  value: ManuellTestStatus;
  title: string;
  disabled?: boolean;
};

const TestregelStatusDropdown = ({
  onChangeStatus,
  testregelId,
  status,
}: Props) => {
  const [show, setShow] = useState(false);

  const handleButtonClick = (status: ManuellTestStatus) => {
    setShow(false);
    onChangeStatus(status, testregelId);
  };

  const isStarted = status !== 'ikkje-starta';
  const isFinished = status === 'ferdig';
  const isActive = isStarted && !isFinished;

  const options: StatusOption[] = [
    {
      label: 'Ferdig',
      value: 'ferdig',
      title: isFinished
        ? 'Test er ferdig'
        : isStarted
          ? 'Sett test ferdig'
          : 'Test ikkje starta',
      disabled: !isActive,
    },
    {
      label: isFinished ? 'Reåpne' : 'Under arbeid',
      value: 'under-arbeid',
      title: isActive
        ? 'Allereie under arbeid'
        : isFinished
          ? 'Reåpne test'
          : 'Sett test under arbeid',
      disabled: isActive,
    },
  ];

  return (
    <div className="status-dropdown">
      <DropdownMenu
        open={show}
        onClose={() => setShow(false)}
        placement="bottom-start"
        size="small"
      >
        <DropdownMenu.Trigger
          aria-haspopup="true"
          aria-expanded={show}
          id="Oppgi status"
          onClick={() => {
            setShow((show) => !show);
          }}
          size="small"
          variant={ButtonVariant.Quiet}
          className="button"
        >
          <CogIcon />
          Oppgi status
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Group>
            {options.map(({ label, value, title, disabled }) => (
              <DropdownMenu.Item
                key={value}
                onClick={() => handleButtonClick(value)}
                disabled={disabled}
                title={title}
              >
                {label}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  );
};

export default TestregelStatusDropdown;
