import { Link } from 'react-router-dom';

import { AppRoute } from '../appRoutes';
import ActionButton, { ButtonType } from './ActionButton';

export interface Props {
  type: ButtonType;
  route: AppRoute;
  disabled?: boolean;
}

const TestlabLinkButton = ({ type, route, disabled = false }: Props) => {
  if (disabled) {
    return <ActionButton type={type} disabled={disabled} />;
  }

  return (
    <Link to={route.path}>
      <ActionButton type={type} />
    </Link>
  );
};

export default TestlabLinkButton;
