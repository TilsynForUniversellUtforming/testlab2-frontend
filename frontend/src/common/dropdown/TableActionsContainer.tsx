import TableActionButton from '@common/button/TableActionButton';
import {
  ButtonColor,
  ButtonColorType,
  ButtonSize,
  ButtonVariant,
} from '@common/types';
import { Table } from '@tanstack/react-table';
import React from 'react';

import ConfirmModalButton from '../confirm/ConfirmModalButton';
import { Action, TableRowAction } from '../table/types';

interface Props<T extends object> {
  actions: TableRowAction[];
  rowActionEnabled?: boolean;
  table: Table<T>;
}

const getButtonColorFromAction = (action: Action): ButtonColorType => {
  switch (action) {
    case 'add':
      return ButtonColor.Success;
    case 'delete':
      return ButtonColor.Danger;
    case 'restart':
      return ButtonColor.Primary;
    case 'save':
      return ButtonColor.Success;
  }
};

export const TableActionsContainer = <T extends object>({
  actions,
  rowActionEnabled = true,
  table,
}: Props<T>) => {
  const onConfirm = (tableRowAction: TableRowAction) => {
    tableRowAction.modalProps?.onConfirm();
    table.resetRowSelection();
    table.setPageIndex(0);
  };

  return (
    <>
      {actions.map((tra, idx) => {
        const color = getButtonColorFromAction(tra.action);
        if (tra.modalProps) {
          return (
            <ConfirmModalButton
              {...tra.modalProps}
              onConfirm={() => onConfirm(tra)}
              key={`${tra.action}_${idx}`}
              disabled={tra.rowSelectionRequired && !rowActionEnabled}
              color={color}
              variant={ButtonVariant.Outline}
              size={ButtonSize.Small}
            />
          );
        } else if (tra.route) {
          return (
            <TableActionButton
              action={tra.action}
              route={tra.route}
              key={`${tra.action}_${idx}`}
              variant={ButtonVariant.Outline}
              color={color}
              size={ButtonSize.Small}
              disabled={tra.rowSelectionRequired && !rowActionEnabled}
            />
          );
        }
      })}
    </>
  );
};

export default TableActionsContainer;
