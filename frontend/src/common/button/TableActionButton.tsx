import { Action } from '@common/table/types';
import { ButtonSizeType, ButtonVariantType } from '@common/types';
import React from 'react';

import { AppRoute } from '../util/routeUtils';
import TestlabLinkButton from './TestlabLinkButton';

export interface TableActionButtonProps {
  action: Action;
  route: AppRoute;
  size?: ButtonSizeType;
  variant?: ButtonVariantType;
  disabled?: boolean;
}

const TableActionButton = ({
  action,
  route,
  size,
  variant,
  disabled = false,
}: TableActionButtonProps) => {
  if (action === 'add') {
    return (
      <TestlabLinkButton
        title="Legg til"
        route={route}
        variant={variant}
        size={size}
        disabled={disabled}
      >
        Legg til
      </TestlabLinkButton>
    );
  }

  if (action === 'save') {
    return (
      <TestlabLinkButton
        title={'Lagre'}
        route={route}
        size={size}
        disabled={disabled}
      >
        Lagre
      </TestlabLinkButton>
    );
  }

  return null;
};

export default TableActionButton;
