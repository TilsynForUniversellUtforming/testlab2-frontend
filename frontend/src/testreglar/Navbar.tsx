import { NavLink } from 'react-router-dom';

import { REGELSETT_LIST, TESTREGEL_LIST } from './TestregelRoutes';

const Navbar = () => {
  return (
    <div className="testreglar__navbar">
      <ul>
        <li>
          <NavLink to={''} end>
            {TESTREGEL_LIST.navn}
          </NavLink>
        </li>
        <li>
          <NavLink to={REGELSETT_LIST.path}>{REGELSETT_LIST.navn}</NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
