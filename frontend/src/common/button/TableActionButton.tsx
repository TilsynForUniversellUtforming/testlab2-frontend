import { ButtonColor } from '@digdir/design-system-react';
import React from 'react';

import { AppRoute } from '../appRoutes';
import TestlabLinkButton from './TestlabLinkButton';

export type TableActionType = 'add' | 'submit';

export interface TableActionButtonProps {
  action: TableActionType;
  route: AppRoute;
  disabled?: boolean;
}

const TableActionButton = ({
  action,
  route,
  disabled = false,
}: TableActionButtonProps) => {
  if (action === 'add') {
    return (
      <TestlabLinkButton
        title={'+ Legg til'}
        route={route}
        color={ButtonColor.Success}
        disabled={disabled}
      />
    );
  }

  if (action === 'submit') {
    return (
      <TestlabLinkButton title={'Lagre'} route={route} disabled={disabled} />
    );
  }

  return null;
};

export default TableActionButton;
