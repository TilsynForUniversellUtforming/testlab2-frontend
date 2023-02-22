import './navigation.scss';

import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';

import { appRoutes, testing, verktoey } from '../appRoutes';
import LinksDropdown from './dropdown/LinksDropdown';

const Navigation = () => {
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href={appRoutes.ROOT.path}>
          {appRoutes.ROOT.navn}
        </Navbar.Brand>
        <Nav className="me-auto">
          <LinksDropdown navn="Verktøy" routes={verktoey} />
          <LinksDropdown navn="Test" routes={testing} />
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Navigation;
