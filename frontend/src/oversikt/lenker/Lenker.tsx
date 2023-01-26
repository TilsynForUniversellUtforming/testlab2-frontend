import './lenker.scss';

import React from 'react';
import { Link } from 'react-router-dom';

import AppTitle from '../../common/app-title/AppTitle';
import { RouteIcon } from '../../common/routes';

interface Props {
  tittel: string;
  routes: RouteIcon[];
}

const Lenker = ({ tittel, routes }: Props) => {
  return (
    <>
      <AppTitle title={tittel} overview />
      <div className="lenker">
        {routes.map((route) => (
          <div className="lenker__item" key={route.navn}>
            <Link to={route.path}>
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
    </>
  );
};

export default Lenker;
