import { Action } from '@common/table/types';
import { ButtonColorType, ButtonSizeType } from '@common/types';
import React from 'react';

import { AppRoute } from '../appRoutes';
import TestlabLinkButton from './TestlabLinkButton';

export interface TableActionButtonProps {
  action: Action;
  route: AppRoute;
  color?: ButtonColorType;
  size?: ButtonSizeType;
  disabled?: boolean;
}

const TableActionButton = ({
  action,
  route,
  color,
  size,
  disabled = false,
}: TableActionButtonProps) => {
  if (action === 'add') {
    return (
      <TestlabLinkButton
        title="Legg til"
        route={route}
        color={color}
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
