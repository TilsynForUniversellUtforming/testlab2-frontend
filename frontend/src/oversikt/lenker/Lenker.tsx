import './lenker.scss';

import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { PathType } from '../../common/paths';

interface Props {
  children: ReactNode;
}

export interface LenkeProps {
  img: string;
  pathType: PathType;
}

const Lenke = ({ img, pathType }: LenkeProps) => {
  const { path, navn } = pathType;
  return (
    <div className="lenker__item">
      <Link to={path}>
        <img className="lenker__img" src={img} alt={navn} />
        <div className="lenker__text">{navn}</div>
      </Link>
    </div>
  );
};

const Lenker = ({ children }: Props) => {
  return <div className="lenker">{children}</div>;
};

Lenker.Lenke = Lenke;

export default Lenker;
