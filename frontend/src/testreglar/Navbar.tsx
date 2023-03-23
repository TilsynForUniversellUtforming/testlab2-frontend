import { NavLink } from 'react-router-dom';

import appRoutes from '../common/appRoutes';

const Navbar = () => {
  return (
    <div className="testreglar__navbar">
      <ul>
        <li>
          <NavLink to={''} end>
            {appRoutes.TESTREGEL_LIST.navn}
          </NavLink>
        </li>
        <li>
          <NavLink to={appRoutes.REGELSETT_LIST.path}>
            {appRoutes.REGELSETT_LIST.navn}
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
