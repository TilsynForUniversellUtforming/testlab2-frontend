import './link-button.scss';

import { Button, ButtonProps } from '@digdir/design-system-react';
import React from 'react';
import { Link } from 'react-router-dom';

import { AppRoute, getFullPath } from '../util/routeUtils';

export interface Props extends ButtonProps {
  route: AppRoute;
  title: string;
  disabled?: boolean;
  redirectExternal?: boolean;
}

const TestlabLinkButton = ({
  title,
  variant,
  color,
  route,
  disabled = false,
  icon,
  size,
  fullWidth,
  redirectExternal = false,
  onClick,
}: Props) => (
  <div className="link-button-wrapper">
    <Link
      to={disabled ? '.' : getFullPath(route)}
      target={redirectExternal ? '_blank' : ''}
    >
      <Button
        variant={variant}
        color={color}
        title={title}
        icon={icon}
        size={size}
        fullWidth={fullWidth}
        disabled={disabled}
        onClick={onClick}
      >
        {title}
      </Button>
    </Link>
  </div>
);

export default TestlabLinkButton;
