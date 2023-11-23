import TableSearch from '@common/table/control/search/TableSearch';
import { Table } from '@tanstack/react-table';
import React from 'react';

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
  const tableElementSize = table.getPreFilteredRowModel().flatRows.length;
  const hasElements = tableElementSize > 0;

  const showFilters = !small && filterPreference !== 'none' && hasElements;

  const showRowActions = rowActions && rowActions.length > 0;

  return (
    <div className="control-header">
      <TableSearch showSearch={showFilters} onChangeFilter={onChangeFilter} />
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
