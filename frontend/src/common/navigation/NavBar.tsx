import './navbar.scss';

import React from 'react';
import { Link } from 'react-router-dom';

import paths from '../paths';

const NavBar = () => {
  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li className="nav-item">
          <Link to={paths.ROOT.path}>UU</Link>
        </li>
        <li className="nav-item">
          <Link to={paths.TESTREGLAR.path}>Testing</Link>
        </li>
        <li className="nav-item">
          <Link to={paths.KRAV.path}>Krav</Link>
        </li>
        <li className="nav-item">
          <Link to={paths.RESULTAT.path}>Resultat</Link>
        </li>
        <li className="nav-item">
          <Link to={paths.LOEYSINGAR.path}>Løysingar</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
