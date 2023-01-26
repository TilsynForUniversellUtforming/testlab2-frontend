import 'bootstrap/dist/css/bootstrap.min.css';

import { NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { Route } from '../routes';

interface Props {
  navn: string;
  routes: Route[];
}

export const LinksDropdown = ({ navn, routes }: Props) => {
  return (
    <NavDropdown title={navn}>
      {routes.map((route) => (
        <NavDropdown.Item key={route.navn} as={Link} to={route.path}>
          {route.navn}
        </NavDropdown.Item>
      ))}
    </NavDropdown>
  );
};

export default LinksDropdown;
