import { NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { AppRoute } from '../../appRoutes';

interface Props {
  navn: string;
  routes: AppRoute[];
}

export const LinksDropdown = ({ navn, routes }: Props) => {
  return (
    <NavDropdown title={navn} className="navbar__dropdown">
      {routes.map((route) => (
        <NavDropdown.Item key={route.navn} as={Link} to={route.path}>
          {route.navn}
        </NavDropdown.Item>
      ))}
    </NavDropdown>
  );
};

export default LinksDropdown;
