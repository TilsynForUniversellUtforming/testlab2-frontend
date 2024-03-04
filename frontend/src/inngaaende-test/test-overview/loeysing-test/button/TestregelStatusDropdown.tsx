import { ButtonVariant } from '@common/types';
import { DropdownMenu } from '@digdir/design-system-react';
import { CogIcon } from '@navikt/aksel-icons';
import { ManuellTestStatus } from '@test/types';
import { useState } from 'react';

interface Props {
  onChangeStatus: (status: ManuellTestStatus, testregelId: number) => void;
  testregelId: number;
}

type StatusOption = {
  label: string;
  value: ManuellTestStatus;
};

const TestregelStatusDropdown = ({ onChangeStatus, testregelId }: Props) => {
  const [show, setShow] = useState(false);

  const handleButtonClick = (status: ManuellTestStatus) => {
    setShow(false);
    onChangeStatus(status, testregelId);
  };

  const options: StatusOption[] = [
    { label: 'Ferdig', value: 'ferdig' },
    { label: 'Under arbeid', value: 'under-arbeid' },
    // { label: 'Ikkje relevant', value: 'deaktivert' },
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
            {options.map(({ label, value }) => (
              <DropdownMenu.Item
                key={value}
                onClick={() => handleButtonClick(value)}
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
