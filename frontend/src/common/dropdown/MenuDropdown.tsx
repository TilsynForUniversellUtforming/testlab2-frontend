import { Button } from '@digdir/design-system-react';
import { MenuHamburgerIcon } from '@navikt/aksel-icons';
import { useRef, useState } from 'react';

import ConfirmModalButton from '../confirm/ConfirmModalButton';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { TableRowAction } from '../table/types';

export interface MenuDropdownProps {
  title: string;
  disabled?: boolean;
  actions: TableRowAction[];
}

const MenuDropdown = ({
  title,
  disabled = false,
  actions,
}: MenuDropdownProps) => {
  const [show, setShow] = useState(false);
  const menuDropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuDropdownRef.current &&
      !menuDropdownRef.current.contains(event.target as Node)
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

  return (
    <div className="dropdown" ref={menuDropdownRef}>
      <Button
        title={title}
        onClick={() => setShow((show) => !show)}
        className="dropdown__button"
        icon={<MenuHamburgerIcon />}
        iconPlacement="right"
        disabled={disabled}
      />
      {show && (
        <ul className="dropdown-content">
          {actions.map((tra) => (
            <li className="dropdown-content__item" key={tra.action}>
              <ConfirmModalButton
                buttonVariant="dropdown"
                {...tra.modalProps}
                onConfirm={() => {
                  tra.modalProps.onConfirm();
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MenuDropdown;
