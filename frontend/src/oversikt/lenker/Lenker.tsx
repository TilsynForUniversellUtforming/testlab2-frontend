import './lenker.scss';

import React from 'react';
import { Link } from 'react-router-dom';

import AppTitle from '../../common/app-title/AppTitle';
import { Path } from '../../common/paths';

interface Props {
  tittel: string;
  paths: Path[];
}

const Lenker = ({ tittel, paths }: Props) => {
  return (
    <>
      <AppTitle title={tittel} overview />
      <div className="lenker">
        {paths.map((path) => (
          <div className="lenker__item" key={path.navn}>
            <Link to={path.path}>
              <img className="lenker__img" src={path.imgSrc} alt={path.navn} />
              <div className="lenker__text">{path.navn}</div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default Lenker;
