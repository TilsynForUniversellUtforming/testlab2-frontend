import { Button } from '@digdir/design-system-react';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import React, { useState } from 'react';

import { TableRowAction } from '../table/types';

interface Props {
  actions: TableRowAction[];
}

export const TableActionDropdown = ({ actions }: Props) => {
  const [show, setShow] = useState(false);

  const handleShowDropdown = () => {
    setShow(!show);
  };

  return (
    <div className="testlab-table dropdown">
      <Button
        onClick={handleShowDropdown}
        className="dropdown__button"
        icon={show ? <ChevronUpIcon /> : <ChevronDownIcon />}
        iconPlacement="right"
        variant="outline"
      >
        Handling
      </Button>
      {show && (
        <ul className="dropdown-content">
          {actions.map((tra) => (
            <li className="dropdown-content__item" key={tra.action}>
              <button
                onClick={() => {
                  tra.onClick();
                  handleShowDropdown();
                }}
                className="dropdown-content__button"
              >
                {tra.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TableActionDropdown;
