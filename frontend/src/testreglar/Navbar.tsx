import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';

import appRoutes from '../common/appRoutes';

const Navbar = () => {
  return (
    <div className="testreglar__navbar">
      <Nav variant="tabs">
        <Nav.Item>
          <Nav.Link as={NavLink} to={''} end>
            {appRoutes.TESTREGEL_LIST.navn}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to={appRoutes.REGELSETT_LIST.path}>
            {appRoutes.REGELSETT_LIST.navn}
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
};

export default Navbar;
