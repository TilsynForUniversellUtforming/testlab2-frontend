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

export const NavigationLinksDropdown = ({ navn, routes }: Props) => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const linksDropdownRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      linksDropdownRef.current &&
      !linksDropdownRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setShow(false);
    }
  };

  const handleButtonClick = (route: AppRoute) => {
    setShow(false);
    if (route.disabled) {
      return;
    }
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
        onClick={() => {
          setShow((show) => !show);
        }}
        className="dropdown__button"
        icon={show ? <ChevronUpIcon /> : <ChevronDownIcon />}
        iconPlacement="right"
        variant={ButtonVariant.Quiet}
        color={ButtonColor.Inverted}
        ref={buttonRef}
        aria-haspopup="true"
        aria-expanded={show}
        id={navn}
      >
        {navn}
      </Button>
      <ul
        className={classNames('dropdown-content links', { show: show })}
        ref={linksDropdownRef}
      >
        {routes.map((route) => (
          <li className="dropdown-content__item" key={route.navn}>
            <div className={classNames('link', { disabled: route.disabled })}>
              <button
                onClick={() => handleButtonClick(route)}
                className="dropdown-content__button"
                aria-disabled={route.disabled}
              >
                {route.navn}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NavigationLinksDropdown;
