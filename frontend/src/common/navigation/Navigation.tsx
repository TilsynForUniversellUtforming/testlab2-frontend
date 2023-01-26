import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';

import LinksDropdown from '../dropdown/LinksDropdown';
import { routes, testing, verktoey } from '../routes';

const Navigation = () => {
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href={routes.ROOT.path}>{routes.ROOT.navn}</Navbar.Brand>
        <Nav className="me-auto">
          <LinksDropdown navn="Verktøy" routes={verktoey} />
          <LinksDropdown navn="Test" routes={testing} />
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Navigation;
