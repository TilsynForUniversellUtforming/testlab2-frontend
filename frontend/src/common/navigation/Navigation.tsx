import './navigation.scss';

import React from 'react';
import { Link } from 'react-router-dom';

import { appRoutes, verktoey } from '../appRoutes';
import LinksDropdown from './dropdown/LinksDropdown';

const Navigation = () => {
  return (
    <div className="navigation">
      <div className="navigation__item">
        <Link to={appRoutes.ROOT.path} className="link">
          {appRoutes.ROOT.navn}
        </Link>
      </div>
      <div className="navigation__item">
        <LinksDropdown navn="Verktøy" routes={verktoey} />
      </div>
    </div>
  );
};

export default Navigation;
