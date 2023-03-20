import React from 'react';
import { NavLink } from 'react-router-dom';

import { editPath } from '../../common/appRoutes';

const SakNavbar = () => {
  return (
    <ul>
      <li>
        <NavLink to={''} end>
          Oversikt
        </NavLink>
      </li>
      <li>
        <NavLink to={editPath}>Rediger måling</NavLink>
      </li>
      <li>
        <div>Nettløysingar</div>
      </li>
      <li>
        <div>Testreglar</div>
      </li>
      <li>
        <div>Testresultat</div>
      </li>
    </ul>
  );
};

export default SakNavbar;
