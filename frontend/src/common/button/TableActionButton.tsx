import { Action } from '@common/table/types';
import {
  ButtonColorType,
  ButtonSizeType,
  ButtonVariantType,
} from '@common/types';
import React from 'react';

import { AppRoute } from '../util/routeUtils';
import TestlabLinkButton from './TestlabLinkButton';

export interface TableActionButtonProps {
  action: Action;
  route: AppRoute;
  color?: ButtonColorType;
  size?: ButtonSizeType;
  variant?: ButtonVariantType;
  disabled?: boolean;
}

const TableActionButton = ({
  action,
  route,
  color,
  size,
  variant,
  disabled = false,
}: TableActionButtonProps) => {
  if (action === 'add') {
    return (
      <TestlabLinkButton
        title="Legg til"
        route={route}
        color={color}
        variant={variant}
        size={size}
        disabled={disabled}
      />
    );
  }

  if (action === 'save') {
    return (
      <TestlabLinkButton
        title={'Lagre'}
        route={route}
        size={size}
        disabled={disabled}
      />
    );
  }

  return null;
};

export default TableActionButton;
