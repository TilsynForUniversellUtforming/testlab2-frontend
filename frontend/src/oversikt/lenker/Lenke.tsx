import React from 'react';
import { Link } from 'react-router-dom';

export interface LenkeProps {
  img: string;
  path: string;
  tekst: string;
}

const Lenke = ({ img, path, tekst }: LenkeProps) => (
  <div className="lenke">
    <Link to={path}>
      <img className="lenke__img" src={img} alt={tekst} />
      <div className="lenke__text">{tekst}</div>
    </Link>
  </div>
);

export default Lenke;
