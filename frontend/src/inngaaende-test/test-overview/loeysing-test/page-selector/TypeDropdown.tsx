import { OptionType } from '@common/types';
import { Button, DropdownMenu } from '@digdir/design-system-react';
import { ChevronDownIcon } from '@navikt/aksel-icons';
import classnames from 'classnames';
import { useState } from 'react';

interface Props {
  title: string;
  typeId: string;
  onChangeType: (typeId?: string) => void;
  options: OptionType[];
}

const TypeDropdown = ({ title, typeId, onChangeType, options }: Props) => {
  const [show, setShow] = useState(false);

  const handleButtonClick = (nettsideId?: string) => {
    setShow(false);
    onChangeType(nettsideId);
  };

  return (
    <div className="page-selector__dropdown">
      <DropdownMenu
        open={show}
        onClose={() => setShow(false)}
        placement="bottom-start"
        size="small"
      >
        <DropdownMenu.Trigger asChild={true}>
          <Button
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
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Group>
            {options.map(({ label, value }) => (
              <DropdownMenu.Item
                key={value}
                onClick={() => handleButtonClick(value)}
                className={classnames({ active: value === typeId })}
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

export default TypeDropdown;
