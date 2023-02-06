import { Link } from 'react-router-dom';

import { Route } from '../routes';
import DigdirButton, { ButtonType } from './DigdirButton';

export interface Props {
  type: ButtonType;
  route: Route;
  disabled?: boolean;
}

const DigdirLinkButton = ({ type, route, disabled = false }: Props) => (
  <Link to={route.path}>
    <DigdirButton type={type} disabled={disabled} />
  </Link>
);

export default DigdirLinkButton;
