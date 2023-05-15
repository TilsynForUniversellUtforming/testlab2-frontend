import './dropdown.scss';

import {
  Button,
  ButtonColor,
  ButtonVariant,
} from '@digdir/design-system-react';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { AppRoute } from '../appRoutes';
import { useEffectOnce } from '../hooks/useEffectOnce';

interface Props {
  navn: string;
  routes: AppRoute[];
}

export const LinksDropdown = ({ navn, routes }: Props) => {
  const [show, setShow] = useState(false);

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
              <Link to={route.path} className="link">
                <button
                  onClick={handleShowRoutes}
                  className="dropdown-content__button"
                >
                  {route.navn}
                </button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LinksDropdown;
