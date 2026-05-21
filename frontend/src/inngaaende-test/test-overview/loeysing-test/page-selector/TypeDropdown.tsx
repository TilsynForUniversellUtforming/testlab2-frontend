import { OptionType } from '@common/types';
import { Dropdown } from '@digdir/designsystemet-react';
import { ChevronDownIcon } from '@navikt/aksel-icons';
import classnames from 'classnames';
import { useState } from 'react';
import style from './TypeDropdown.module.scss';

interface Props {
  title: string;
  typeId: number;
  onChangeType: (typeId: number) => void;
  options: OptionType[];
}

const TypeDropdown = ({ title, typeId, onChangeType, options }: Props) => {
  const [show, setShow] = useState(false);

  const handleButtonClick = (typeId: string) => {
    setShow(false);
    onChangeType(Number(typeId));
  };

  return (
    <div className="page-selector__dropdown">
      <Dropdown.TriggerContext>
        <Dropdown.Trigger>
          {title}
          <ChevronDownIcon
            className="chevron-icon"
            style={{ transform: show ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </Dropdown.Trigger>

        <Dropdown placement="bottom-start" data-size="md">
          <Dropdown.List>
            {options.map((option, index) => (
              <Dropdown.Item
                key={index}
                onClick={() => handleButtonClick(String(option.value))}
                className={classnames({
                  active: option.value === String(typeId),
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
