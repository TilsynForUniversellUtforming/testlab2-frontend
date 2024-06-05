import './dropdown.scss';

import { ButtonSize, ButtonVariant } from '@common/types';
import { DropdownMenu } from '@digdir/designsystemet-react';
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
      <DropdownMenu
        open={show}
        onClose={() => setShow(false)}
        size={ButtonSize.Small}
        placement="bottom-start"
      >
        <DropdownMenu.Trigger
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
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Group>
            {routes.map((route) => {
              if (route.disabled) {
                return (
                  <DropdownMenu.Item key={route.navn} disabled>
                    {route.navn}
                  </DropdownMenu.Item>
                );
              }

              return (
                <DropdownMenu.Item
                  key={route.navn}
                  onClick={() => handleButtonClick(route)}
                >
                  {route.navn}
                </DropdownMenu.Item>
              );
            })}
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  );
};

export default NavigationLinksDropdown;
