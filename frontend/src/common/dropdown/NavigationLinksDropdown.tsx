import './dropdown.scss';

import { ButtonColor, ButtonSize, ButtonVariant } from '@common/types';
import { Button, DropdownMenu } from '@digdir/design-system-react';
import { ChevronDownIcon } from '@navikt/aksel-icons';
import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppRoute, getFullPath } from '../util/routeUtils';

interface Props {
  navn: string;
  routes: AppRoute[];
}

export const NavigationLinksDropdown = ({ navn, routes }: Props) => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const anchorEl = useRef(null);

  const handleButtonClick = (route: AppRoute) => {
    setShow(false);
    if (route.disabled) {
      return;
    }
    navigate(getFullPath(route));
  };

  return (
    <div className="dropdown">
      <Button
        className={classNames('dropdown__button', { show: show })}
        onClick={() => {
          setShow((show) => !show);
        }}
        variant={ButtonVariant.Quiet}
        color={ButtonColor.Inverted}
        ref={anchorEl}
        aria-haspopup="true"
        aria-expanded={show}
        id={navn}
      >
        {navn}
        <ChevronDownIcon className="chevron-icon" />
      </Button>
      <div className={classNames('dropdown-content links', { show })}>
        <DropdownMenu
          anchorEl={anchorEl.current}
          open={show}
          onClose={() => setShow(false)}
          size={ButtonSize.Small}
          placement="bottom"
        >
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
        </DropdownMenu>
      </div>
    </div>
  );
};

export default NavigationLinksDropdown;
