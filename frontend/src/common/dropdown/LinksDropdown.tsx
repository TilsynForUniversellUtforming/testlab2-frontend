import 'bootstrap/dist/css/bootstrap.min.css';

import { NavDropdown } from 'react-bootstrap';

import { Path } from '../paths';

interface Props {
  navn: string;
  pathTypes: Path[];
}

export const LinksDropdown = ({ navn, pathTypes }: Props) => {
  return (
    <NavDropdown title={navn} id="collasible-nav-dropdown">
      {pathTypes.map((pt) => (
        <NavDropdown.Item key={pt.navn} href={pt.path}>
          {pt.navn}
        </NavDropdown.Item>
      ))}
    </NavDropdown>
  );
};

export default LinksDropdown;
