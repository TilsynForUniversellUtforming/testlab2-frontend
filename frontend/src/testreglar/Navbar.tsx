import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';

import routes from '../common/routes';

const Navbar = () => {
  return (
    <div className="testreglar__navbar">
      <Nav variant="tabs">
        <Nav.Item>
          <Nav.Link as={NavLink} to={''} end>
            {routes.TESTREGLAR.navn}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to={routes.REGELSETT.path}>
            {routes.REGELSETT.navn}
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
};

export default Navbar;
