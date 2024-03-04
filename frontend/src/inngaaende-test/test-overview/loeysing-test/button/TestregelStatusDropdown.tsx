import { ButtonVariant } from '@common/types';
import { DropdownMenu } from '@digdir/design-system-react';
import { CogIcon } from '@navikt/aksel-icons';
import { ManuellTestStatus } from '@test/types';
import { useState } from 'react';

interface Props {
  onChangeStatus: (status: ManuellTestStatus, testregelId: number) => void;
  testregelId: number;
  isStarted: boolean;
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
  isStarted,
}: Props) => {
  const [show, setShow] = useState(false);

  const handleButtonClick = (status: ManuellTestStatus) => {
    setShow(false);
    onChangeStatus(status, testregelId);
  };

  const options: StatusOption[] = [
    {
      label: 'Ferdig',
      value: 'ferdig',
      title: isStarted ? 'Sett status ferdig' : 'Test ikkje starta',
      disabled: !isStarted,
    },
    {
      label: 'Under arbeid',
      value: 'under-arbeid',
      title: 'Sett status under arbeid',
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
