import './link-button.scss';

import { Button, ButtonProps } from '@digdir/designsystemet-react';
import { Size } from '@digdir/designsystemet-types';
import { Link } from 'react-router-dom';

import { AppRoute, getFullPath, IdReplacement } from '../util/routeUtils';

export interface Props extends ButtonProps {
  route: AppRoute;
  ids?: IdReplacement[];
  title: string;
  disabled?: boolean;
  redirectExternal?: boolean;
  fullWidth?: boolean;
  size?: Size
}

const TestlabLinkButton = ({
  title,
  variant,
  color,
  route,
  ids = [],
  disabled = false,
  icon,
  size,
  fullWidth,
  redirectExternal = false,
  onClick,
  children,
}: Props) => (
  <div className="link-button-wrapper">
    <Link
      to={disabled ? '.' : getFullPath(route, ...ids)}
      target={redirectExternal ? '_blank' : ''}
    >
      <Button
        variant={variant}
        color={color}
        title={title}
        data-size={size}
        icon={icon}
        data-fullwidth={fullWidth}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </Button>
    </Link>
  </div>
);

export default TestlabLinkButton;
