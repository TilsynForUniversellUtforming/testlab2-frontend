import './dropdown.scss';

import { Button, ButtonVariant } from '@digdir/design-system-react';
import { ChevronDownIcon, ChevronUpIcon } from '@digdir/ds-icons';
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
        variant={ButtonVariant.Quiet}
        onClick={handleShowRoutes}
        icon={show ? <ChevronUpIcon /> : <ChevronDownIcon />}
        className="dropdown__button"
      >
        {navn}
      </Button>
      {show && (
        <ul className="dropdown-content">
          {routes.map((route) => (
            <li className="dropdown-content__item" key={route.navn}>
              {/*onClick={handleShowRoutes}*/}
              <Link to={route.path} className="link">
                {route.navn}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LinksDropdown;
