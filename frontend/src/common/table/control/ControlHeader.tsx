import TableSearch from '@common/table/control/search/TableSearch';
import { Table } from '@tanstack/react-table';
import React, { useCallback } from 'react';

import TableActionsContainer from '../../dropdown/TableActionsContainer';
import { TableFilterPreference, TableRowAction } from '../types';

export interface Props<T extends object> {
  table: Table<T>;
  filterPreference: TableFilterPreference;
  onChangeFilter: (value: string) => void;
  rowActions?: TableRowAction[];
  rowActionEnabled: boolean;
  small?: boolean;
}

const ControlHeader = <T extends object>({
  table,
  filterPreference,
  onChangeFilter,
  rowActions,
  rowActionEnabled,
  small = false,
}: Props<T>) => {
  const filteredRowCount = table.getPreFilteredRowModel().flatRows.length;
  const hasVisibleRows = filteredRowCount > 0;

  const showFilters = !small && filterPreference !== 'none' && hasVisibleRows;
  const showRowActions = Array.isArray(rowActions) && rowActions.length > 0;

  const handleResetPagination = useCallback(() => {
    table.setPageIndex(0);
  }, [table]);

  return (
    <div className="control-header">
      <TableSearch
        showSearch={showFilters}
        onChangeFilter={onChangeFilter}
        resetPagination={handleResetPagination}
      />
      <div className="control-header__actions">
        {showRowActions && (
          <TableActionsContainer<T>
            actions={rowActions}
            rowActionEnabled={rowActionEnabled}
            table={table}
          />
        )}
      </div>
    </div>
  );
};

export default ControlHeader;
