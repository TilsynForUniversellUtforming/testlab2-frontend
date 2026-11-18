import { ButtonVariant } from '@common/types';
import { Button, Dropdown } from '@digdir/designsystemet-react';
import { CogIcon } from '@navikt/aksel-icons';
import { Key, useState } from 'react';

import styles from './testregel-button.module.scss';

export type StatusDropdownOption<T> = {
  label: string;
  value: T;
  title?: string;
  disabled?: boolean;
};

interface StatusDropdownProps<T> {
  id: string;
  options: StatusDropdownOption<T>[];
  onSelect: (value: T) => void;
  buttonLabel?: string;
}

const StatusDropdown = <T extends Key | null | undefined,>({
  id,
  options,
  onSelect,
  buttonLabel = 'Oppgi status',
}: StatusDropdownProps<T>) => {
  const [show, setShow] = useState(false);

  const handleButtonClick = (value: T) => {
    setShow(false);
    onSelect(value);
  };

  return (
    <div className={styles.statusDropdown}>
      <Button
        popovertarget={id}
        variant={ButtonVariant.Quiet}
        className={'button'}
        onClick={() => setShow((current) => !current)}
        data-size={'sm'}
      >
        <CogIcon />
        {buttonLabel}
      </Button>
      <Dropdown
        open={show}
        onClose={() => setShow(false)}
        placement="bottom-start"
        data-size="sm"
        id={id}
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

export default StatusDropdown;
