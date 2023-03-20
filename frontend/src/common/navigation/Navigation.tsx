import './navigation.scss';

import React from 'react';

import { appRoutes, verktoey } from '../appRoutes';
import LinksDropdown from './dropdown/LinksDropdown';

const Navigation = () => {
  return (
    <div>
      <a href={appRoutes.ROOT.path}>{appRoutes.ROOT.navn}</a>
      <div className="me-auto">
        <LinksDropdown navn="Verktøy" routes={verktoey} />
      </div>
    </div>
  );
};

export default Navigation;
