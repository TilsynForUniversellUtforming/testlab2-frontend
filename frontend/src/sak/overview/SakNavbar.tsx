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
        <NavLink to={editPath}>Rediger sak</NavLink>
      </li>
      <li>
        <div>Målingar</div>
      </li>
    </ul>
  );
};

export default SakNavbar;
