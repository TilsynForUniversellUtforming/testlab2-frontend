import './dropdown.scss';

import { ButtonSize, ButtonVariant } from '@common/types';
import { Dropdown } from '@digdir/designsystemet-react';
import { ChevronDownIcon } from '@navikt/aksel-icons';
import classNames from 'classnames';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppRoute, getFullPath } from '../util/routeUtils';

interface Props {
  navn: string;
  routes: AppRoute[];
}

export const NavigationLinksDropdown = ({ navn, routes }: Props) => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleButtonClick = (route: AppRoute) => {
    setShow(false);
    if (route.disabled) {
      return;
    }
    navigate(getFullPath(route));
  };

  return (
    <div className={classNames('dropdown-content links', { show })}>
      <Dropdown.TriggerContext>
        <Dropdown.Trigger
          className={classNames('dropdown__button', { show: show })}
          onClick={() => {
            setShow((show) => !show);
          }}
          variant={ButtonVariant.Quiet}
          aria-haspopup="true"
          aria-expanded={show}
          id={navn}
        >
          {navn}
          <ChevronDownIcon className="chevron-icon" />
        </Dropdown.Trigger>
        <Dropdown>
        <Dropdown.List>
            {routes.map((route) => {
              if (route.disabled) {
                return (
                  <Dropdown.Item key={route.navn} aria-disabled>
                    {route.navn}
                  </Dropdown.Item>
                );
              }

              return (
                <Dropdown.Item
                  key={route.navn}
                  onClick={() => handleButtonClick(route)}
                >
                  {route.navn}
                </Dropdown.Item>
              );
            })}
        </Dropdown.List>
        </Dropdown>
      </Dropdown.TriggerContext>
    </div>
  );
};

export default NavigationLinksDropdown;
