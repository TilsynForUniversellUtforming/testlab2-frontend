import './link-button.scss';

import { Button, ButtonProps } from '@digdir/design-system-react';
import React from 'react';
import { Link } from 'react-router-dom';

import { AppRoute, getFullPath } from '../appRoutes';

export interface Props extends ButtonProps {
  route: AppRoute;
  title: string;
  disabled?: boolean;
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
}: Props) => {
  if (disabled) {
    return <Button variant={variant} color={color} title={title} disabled />;
  }

  return (
    <div className="link-button-wrapper">
      <Link to={getFullPath(route)}>
        <Button
          variant={variant}
          color={color}
          title={title}
          icon={icon}
          size={size}
          fullWidth={fullWidth}
        >
          {title}
        </Button>
      </Link>
    </div>
  );
};

export default TestlabLinkButton;
