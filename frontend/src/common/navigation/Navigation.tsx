import './navigation.scss';

import {
  Button,
  ButtonColor,
  ButtonVariant,
} from '@digdir/design-system-react';
import { MenuHamburgerIcon } from '@navikt/aksel-icons';
import classNames from 'classnames';
import React, { useState } from 'react';

import { anna, appRoutes, saksbehandling, testing, utval } from '../appRoutes';
import TestlabLinkButton from '../button/TestlabLinkButton';
import LinksDropdown from '../dropdown/LinksDropdown';

const Navigation = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="navigation">
      <div className="home">
        <TestlabLinkButton
          route={appRoutes.ROOT}
          className="link"
          title={appRoutes.ROOT.navn}
          variant={ButtonVariant.Quiet}
          color={ButtonColor.Inverted}
        />
      </div>
      <div className={classNames('navigation__list', { open: open })}>
        <Button
          className="hamburger"
          variant={ButtonVariant.Quiet}
          color={ButtonColor.Inverted}
          icon={<MenuHamburgerIcon />}
          onClick={() => setOpen((open) => !open)}
          aria-expanded={open}
          title="Meny for verktøy"
          aria-label="Meny for verktøy"
        />
        <div className="navigation__item">
          <LinksDropdown navn="Utval" routes={utval} />
        </div>
        <div className="navigation__item">
          <LinksDropdown navn="Saksbehandling" routes={saksbehandling} />
        </div>
        <div className="navigation__item">
          <LinksDropdown navn="Testing" routes={testing} />
        </div>
        <div className="navigation__item">
          <LinksDropdown navn="Anna" routes={anna} />
        </div>
      </div>
    </div>
  );
};

export default Navigation;
