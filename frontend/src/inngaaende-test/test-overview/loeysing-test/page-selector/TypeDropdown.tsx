import { capitalize } from '@common/util/stringutils';
import { Button, DropdownMenu } from '@digdir/design-system-react';
import { ChevronDownIcon } from '@navikt/aksel-icons';
import { NettsideProperties } from '@sak/types';
import classnames from 'classnames';
import { useRef, useState } from 'react';

interface Props {
  title: string;
  selectedType: string;
  onChangeType: (type?: string) => void;
  sakProperties: NettsideProperties[];
}

const TypeDropdown = ({
  title,
  selectedType,
  onChangeType,
  sakProperties,
}: Props) => {
  const anchorEl = useRef(null);
  const [show, setShow] = useState(false);

  const handleButtonClick = (type?: string) => {
    setShow(false);
    onChangeType(type);
  };

  return (
    <div className="page-selector__dropdown">
      <Button
        icon={
          <>
            <ChevronDownIcon
              className="chevron-icon"
              style={{ transform: show ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </>
        }
        iconPlacement="right"
        ref={anchorEl}
        aria-haspopup="true"
        aria-expanded={show}
        id={title}
        onClick={() => {
          setShow((show) => !show);
        }}
        size="small"
      >
        {title}
      </Button>
      <DropdownMenu
        anchorEl={anchorEl.current}
        open={show}
        onClose={() => setShow(false)}
        placement="bottom-start"
        size="small"
      >
        <DropdownMenu.Group>
          {sakProperties.map(({ type }) => {
            if (!type) {
              return null;
            }

            return (
              <DropdownMenu.Item
                key={type}
                onClick={() => handleButtonClick(type)}
                className={classnames({ active: type === selectedType })}
              >
                {capitalize(type)}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Group>
      </DropdownMenu>
    </div>
  );
};

export default TypeDropdown;
