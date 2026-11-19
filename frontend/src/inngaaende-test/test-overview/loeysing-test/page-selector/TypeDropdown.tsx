import { OptionType } from '@common/types';
import { Dropdown } from '@digdir/designsystemet-react';
import { ChevronDownIcon } from '@navikt/aksel-icons';
import classnames from 'classnames';
import { useState } from 'react';
import styles from '../loeysing-test.module.css';

interface Props {
  title: string;
  typeId: number;
  onChangeType: (typeId: number) => void;
  options: OptionType[];
}

type DropdownOptions = {
  index: number;
} & OptionType

const TypeDropdown = ({ title, typeId, onChangeType, options }: Props) => {
  const [show, setShow] = useState(false);

  const handleButtonClick = (typeId: string) => {
    setShow(false);
    onChangeType(Number(typeId));
  };

  const dropdownOptions: DropdownOptions[] = options.map((option, index) => ({
    ...option,
    index,
  }));

  return (
    <div className={styles.pageSelectorDropdown}>
      <Dropdown.TriggerContext>
        <Dropdown.Trigger onClick={() => setShow((prev) => !prev)}>
          {title}
          <ChevronDownIcon
            className={styles.chevronIcon}
            style={{ transform: show ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </Dropdown.Trigger>

        <Dropdown placement="bottom-start" data-size="md">
          <Dropdown.List>
            {dropdownOptions.map((option) => (
              <Dropdown.Item
                key={option.index}
                onClick={() => handleButtonClick(String(option.value))}
                className={classnames({
                  [styles.active]: option.value === String(typeId),
                })}
              >
                {option.label}
              </Dropdown.Item>
            ))}
          </Dropdown.List>
        </Dropdown>
      </Dropdown.TriggerContext>
    </div>
  );
};

export default TypeDropdown;
