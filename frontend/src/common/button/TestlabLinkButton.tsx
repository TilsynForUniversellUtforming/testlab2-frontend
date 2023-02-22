import { Link } from 'react-router-dom';

import { AppRoute } from '../appRoutes';
import UserActionButton, { ButtonType } from './UserActionButton';

export interface Props {
  type: ButtonType;
  route: AppRoute;
  disabled?: boolean;
}

const TestlabLinkButton = ({ type, route, disabled = false }: Props) => {
  if (disabled) {
    return <UserActionButton type={type} disabled={disabled} />;
  }

  return (
    <Link to={route.path}>
      <UserActionButton type={type} />
    </Link>
  );
};

export default TestlabLinkButton;
