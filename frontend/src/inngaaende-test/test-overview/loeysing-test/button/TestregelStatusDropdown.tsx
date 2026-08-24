import { ButtonVariant } from '@common/types';
import { Button, Dropdown } from '@digdir/designsystemet-react';
import { CogIcon } from '@navikt/aksel-icons';
import { ButtonStatus, ManuellTestStatus } from '@test/types';
import { useState } from 'react';

import styles from './testregel-button.module.scss';

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
      title: isFinishedTitle(isFinished, isStarted),
      disabled: !isActive,
    },
    {
      label: isFinished ? 'Reåpne' : 'Under arbeid',
      value: 'under-arbeid',
      title: isStartedTitle(isActive, isFinished),
      disabled: isActive,
    },
  ];

  return (
    <div className={styles.statusDropdown}>
      <Button
        popovertarget={`test-status-dropdown-${testregelId}`}
        variant={ButtonVariant.Quiet}
        className={'button'}
        onClick={() => {
          setShow((show) => !show);
        }}
      >
        <CogIcon />
        Oppgi status
      </Button>
      <Dropdown
        open={show}
        onClose={() => setShow(false)}
        placement="bottom-start"
        data-size="sm"
        id={`test-status-dropdown-${testregelId}`}
      >
        <Dropdown.List>
          {options.map(({ label, value, title, disabled }) => (
            <Dropdown.Item key={value}>
              <Dropdown.Button
                onClick={() => handleButtonClick(value)}
                disabled={disabled}
                title={title}
              >
                {label}
              </Dropdown.Button>
            </Dropdown.Item>
          ))}
        </Dropdown.List>
      </Dropdown>
    </div>
  );
};


function isFinishedTitle  (isFinished: boolean, isStarted: boolean)  {

  if(isFinished) {
    return 'Test er ferdig'
  }
  else if(isStarted) {
    return 'Sett test ferdig'
  }
  return 'Test ikkje starta'
}

function isStartedTitle  (isActive: boolean, isFinished: boolean)  {
  if(isActive) {
    return 'Allereie under arbeid'
  }
  else if(isFinished) {
    return 'Reåpne test'
  }
  return 'Sett test under arbeid'
}
export default TestregelStatusDropdown;
