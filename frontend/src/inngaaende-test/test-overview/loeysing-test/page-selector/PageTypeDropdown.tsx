import { capitalize } from '@common/util/stringutils';
import { Button, DropdownMenu } from '@digdir/design-system-react';
import { ChevronDownIcon } from '@navikt/aksel-icons';
import { NettsidePropertyType } from '@sak/form/steps/loeysing/inngaaende/loeysing-nettisde/types';
import { NettsideProperties } from '@sak/types';
import classnames from 'classnames';
import { useRef, useState } from 'react';

interface Props {
  title: string;
  pageType: NettsidePropertyType;
  onChangePageType: (pageType?: NettsidePropertyType) => void;
  sakProperties: NettsideProperties[];
}

const PageTypeDropdown = ({
  title,
  pageType,
  onChangePageType,
  sakProperties,
}: Props) => {
  const anchorEl = useRef(null);
  const [show, setShow] = useState(false);

  const handleButtonClick = (pageType?: NettsidePropertyType) => {
    setShow(false);
    onChangePageType(pageType);
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
                className={classnames({ active: type === pageType })}
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

export default PageTypeDropdown;
