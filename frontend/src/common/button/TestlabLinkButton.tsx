import './link-button.scss';

import { Button, ButtonProps } from '@digdir/design-system-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  return (
    <div className="link-button-wrapper">
      <Button
        variant={variant}
        color={color}
        title={title}
        icon={icon}
        size={size}
        fullWidth={fullWidth}
        onClick={() => navigate(getFullPath(route))}
        disabled={disabled}
      >
        {title}
      </Button>
    </div>
  );
};

export default TestlabLinkButton;
