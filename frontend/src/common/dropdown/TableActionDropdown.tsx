import { Button } from '@digdir/design-system-react';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Table } from '@tanstack/react-table';
import React, { useRef, useState } from 'react';

import ConfirmModalButton from '../confirm/ConfirmModalButton';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { TableRowAction } from '../table/types';

interface Props {
  actions: TableRowAction[];
  disabled?: boolean;
  table: Table<any>;
}

export const TableActionDropdown = ({
  actions,
  disabled = false,
  table,
}: Props) => {
  const [show, setShow] = useState(false);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShow(false);
    }
  };

  useEffectOnce(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  const handleShowDropdown = () => {
    setShow(!show);
  };

  return (
    <>
      <Button
        onClick={handleShowDropdown}
        className="dropdown__button"
        icon={show ? <ChevronUpIcon /> : <ChevronDownIcon />}
        iconPlacement="right"
        variant="outline"
        disabled={disabled}
      >
        Handling
      </Button>
      {show && (
        <ul className="dropdown-content" ref={dropdownRef}>
          {actions.map((tra) => (
            <li className="dropdown-content__item" key={tra.action}>
              <ConfirmModalButton
                buttonVariant="dropdown"
                {...tra.modalProps}
                onConfirm={() => {
                  tra.modalProps.onConfirm();
                  table.resetRowSelection();
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default TableActionDropdown;
