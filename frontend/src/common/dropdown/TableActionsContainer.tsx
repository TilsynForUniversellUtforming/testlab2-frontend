import TableActionButton from '@common/button/TableActionButton';
import ConfirmModalButton from '@common/confirm-modal/ConfirmModalButton';
import { ButtonSize } from '@common/types';
import { Table } from '@tanstack/react-table';
import React from 'react';

import { LegacyTableRowAction } from '../table/types';

interface Props<T extends object> {
  actions: LegacyTableRowAction[];
  rowActionEnabled?: boolean;
  table: Table<T>;
}

export const TableActionsContainer = <T extends object>({
  actions,
  rowActionEnabled = true,
  table,
}: Props<T>) => {
  const onConfirm = (LegacyTableRowAction: LegacyTableRowAction) => {
    LegacyTableRowAction.modalProps?.onConfirm();
    table.resetRowSelection();
    table.setPageIndex(0);
  };

  return (
    <>
      {actions.map((tra, idx) => {
        if (tra.modalProps) {
          return (
            <ConfirmModalButton
              {...tra.modalProps}
              onConfirm={() => onConfirm(tra)}
              key={`${tra.action}_${idx}`}
              disabled={tra.rowSelectionRequired && !rowActionEnabled}
              size={ButtonSize.Small}
            />
          );
        } else if (tra.route) {
          return (
            <TableActionButton
              action={tra.action}
              route={tra.route}
              key={`${tra.action}_${idx}`}
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
