import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';

import { editPath } from '../../common/appRoutes';

const SakNavbar = () => {
  return (
    <Nav variant="tabs">
      <Nav.Item>
        <Nav.Link as={NavLink} to={''} end>
          Oversikt
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={NavLink} to={editPath}>
          Rediger måling
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="disabled" disabled>
          Nettløysingar
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="disabled" disabled>
          Testreglar
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="disabled" disabled>
          Testresultat
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default SakNavbar;
