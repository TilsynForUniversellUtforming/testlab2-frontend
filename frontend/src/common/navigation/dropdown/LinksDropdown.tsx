import {
  Button,
  ButtonColor,
  ButtonVariant,
} from '@digdir/design-system-react';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { AppRoute } from '../../appRoutes';

interface Props {
  navn: string;
  routes: AppRoute[];
}

export const LinksDropdown = ({ navn, routes }: Props) => {
  const [show, setShow] = useState(false);

  const handleShowRoutes = () => {
    setShow(!show);
  };

  return (
    <div className="dropdown">
      <Button
        onClick={handleShowRoutes}
        className="dropdown__button"
        icon={
          show ? (
            <ChevronUpIcon color="white" />
          ) : (
            <ChevronDownIcon color="white" />
          )
        }
        iconPlacement="right"
        variant={ButtonVariant.Quiet}
        color={ButtonColor.Inverted}
      >
        {navn}
      </Button>
      {show && (
        <ul className="dropdown-content">
          {routes.map((route) => (
            <li className="dropdown-content__item" key={route.navn}>
              <Link to={route.path} className="link">
                <button onClick={handleShowRoutes} className="link-button">
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
