import './dropdown.scss';

import {
  Button,
  ButtonColor,
  ButtonVariant,
} from '@digdir/design-system-react';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppRoute, getFullPath } from '../appRoutes';
import { useEffectOnce } from '../hooks/useEffectOnce';

interface Props {
  navn: string;
  routes: AppRoute[];
}

export const LinksDropdown = ({ navn, routes }: Props) => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleShowRoutes = () => {
    setShow(!show);
  };

  const linksDropdownRef = useRef<HTMLUListElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      linksDropdownRef.current &&
      !linksDropdownRef.current.contains(event.target as Node)
    ) {
      setShow(false);
    }
  };

  const handleButtonClick = (route: AppRoute) => {
    handleShowRoutes();
    navigate(getFullPath(route));
  };

  useEffectOnce(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  return (
    <div className="dropdown">
      <Button
        onClick={handleShowRoutes}
        className="dropdown__button"
        icon={show ? <ChevronUpIcon /> : <ChevronDownIcon />}
        iconPlacement="right"
        variant={ButtonVariant.Quiet}
        color={ButtonColor.Inverted}
      >
        {navn}
      </Button>
      {show && (
        <ul className="dropdown-content links" ref={linksDropdownRef}>
          {routes.map((route) => (
            <li className="dropdown-content__item" key={route.navn}>
              <div className={classNames('link', { disabled: route.disabled })}>
                <button
                  onClick={() => handleButtonClick(route)}
                  className="dropdown-content__button"
                  disabled={route.disabled}
                >
                  {route.navn}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LinksDropdown;
