import './navigation.scss';

import { ButtonColor, ButtonVariant } from '@digdir/design-system-react';
import React from 'react';

import { appRoutes, saksbehandling, utval } from '../appRoutes';
import TestlabLinkButton from '../button/TestlabLinkButton';
import LinksDropdown from '../dropdown/LinksDropdown';

const Navigation = () => {
  return (
    <div className="navigation">
      <div className="navigation__item">
        <TestlabLinkButton
          route={appRoutes.ROOT}
          className="link"
          title={appRoutes.ROOT.navn}
          variant={ButtonVariant.Quiet}
          color={ButtonColor.Inverted}
        />
      </div>
      <div className="navigation__item">
        <LinksDropdown navn="Saksbehandling" routes={saksbehandling} />
      </div>
      <div className="navigation__item">
        <LinksDropdown navn="Utval" routes={utval} />
      </div>
    </div>
  );
};

export default Navigation;
