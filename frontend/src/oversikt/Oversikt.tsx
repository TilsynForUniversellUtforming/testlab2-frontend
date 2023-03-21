import './Oversikt.scss';

import React from 'react';
import { Link } from 'react-router-dom';

import AppTitle from '../common/app-title/AppTitle';
import { getFullPath, verktoey } from '../common/appRoutes';

const Oversikt = () => {
  return (
    <div>
      <AppTitle title="Verktøy" />
      <div className="lenker">
        {verktoey.map((route) => (
          <div className="lenker__item" key={route.navn}>
            <Link to={getFullPath(route)}>
              <img
                className="lenker__img"
                src={route.imgSrc}
                alt={route.navn}
              />
              <div className="lenker__text">{route.navn}</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Oversikt;
