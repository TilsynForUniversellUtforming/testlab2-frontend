import './navigation.scss';

import { ButtonColor, ButtonVariant } from '@digdir/design-system-react';
import React from 'react';

import { appRoutes, verktoey } from '../appRoutes';
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
        <LinksDropdown navn="Verktøy" routes={verktoey} />
      </div>
    </div>
  );
};

export default Navigation;
