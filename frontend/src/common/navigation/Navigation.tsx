import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';

import LinksDropdown from '../dropdown/LinksDropdown';
import { paths, testing, verktoey } from '../paths';

const Navigation = () => {
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href={paths.ROOT.path}>{paths.ROOT.navn}</Navbar.Brand>
        <Nav className="me-auto">
          <LinksDropdown navn="Verktøy" pathTypes={verktoey} />
          <LinksDropdown navn="Test" pathTypes={testing} />
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Navigation;
