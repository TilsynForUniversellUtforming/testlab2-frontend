import './dropdown.scss';

import { Link } from 'react-router-dom';

import { AppRoute } from '../../appRoutes';

interface Props {
  navn: string;
  routes: AppRoute[];
}

export const LinksDropdown = ({ navn, routes }: Props) => {
  return (
    <div className="dropdown">
      <span>{navn}</span>
      <div className="dropdown-content">
        {routes.map((route) => (
          <Link key={route.navn} to={route.path}>
            {route.navn}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LinksDropdown;
