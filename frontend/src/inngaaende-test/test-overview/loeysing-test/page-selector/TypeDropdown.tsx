import { OptionType } from '@common/types';
import { Dropdown } from '@digdir/designsystemet-react';
import { ChevronDownIcon } from '@navikt/aksel-icons';
import classnames from 'classnames';
import { useState } from 'react';

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
      <Dropdown
        open={show}
        onClose={() => setShow(false)}
        placement="bottom-start"
        data-size="sm"
      >
        <Dropdown.Trigger
          aria-haspopup="true"
          aria-expanded={show}
          id={title}
          onClick={() => {
            setShow((show) => !show);
          }}
        >
          {title}
          <ChevronDownIcon
            className="chevron-icon"
            style={{ transform: show ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </Dropdown.Trigger>
          <Dropdown.List>
            {options.map(({ label, value }) => (
              <Dropdown.Item
                key={value}
                onClick={() => handleButtonClick(value)}
                className={classnames({ active: value === String(typeId) })}
              >
                {label}
              </Dropdown.Item>
            ))}
          </Dropdown.List>
      </Dropdown>
    </div>
  );
};

export default TypeDropdown;
