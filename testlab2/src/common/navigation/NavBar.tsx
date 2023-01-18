import './navbar.scss';

import React from 'react';
import { Link } from 'react-router-dom';

import { Paths } from '../paths';

const NavBar = () => {
  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li className="nav-item">
          <Link to={Paths.ROOT}>UU</Link>
        </li>
        <li className="nav-item">
          <Link to={Paths.TEST}>Testing</Link>
        </li>
        <li className="nav-item">
          <Link to={Paths.KRAV}>Krav</Link>
        </li>
        <li className="nav-item">
          <Link to={Paths.RESULTAT}>Resultat</Link>
        </li>
        <li className="nav-item">
          <Link to={Paths.LOEYSINGAR}>Løysingar</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
