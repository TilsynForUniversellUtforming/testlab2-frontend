import { Spinner } from '@digdir/design-system-react';
import { Table } from '@tanstack/react-table';
import React from 'react';

import DebouncedInput from '../../debounced-input/DebouncedInput';
import TableActionsContainer from '../../dropdown/TableActionsContainer';
import { TableFilterPreference, TableRowAction } from '../types';

export interface Props<T extends object> {
  table: Table<T>;
  filterPreference: TableFilterPreference;
  filterValue: string;
  onChangeFilter: (value: string | number) => void;
  rowActions?: TableRowAction[];
  rowActionEnabled: boolean;
  small?: boolean;
  loadingStateStatus?: string;
}

const ControlHeader = <T extends object>({
  table,
  filterPreference,
  filterValue,
  onChangeFilter,
  rowActions,
  rowActionEnabled,
  small = false,
  loadingStateStatus,
}: Props<T>) => {
  const tableElementSize = table.getPreFilteredRowModel().flatRows.length;
  const hasElements = tableElementSize > 0;

  const showFilters = !small && filterPreference !== 'none' && hasElements;

  const showRowActions = rowActions && rowActions.length > 0;

  return (
    <div className="control-header">
      <div className="control-header__search">
        {loadingStateStatus && (
          <div>
            {`${loadingStateStatus} `}
            <Spinner title={loadingStateStatus} size="small" />
          </div>
        )}
        {showFilters && (
          <DebouncedInput
            label="Søk i tabell"
            value={filterValue}
            onChange={onChangeFilter}
            ariaLabel={'Søk i tabell'}
            id={'search-input'}
          />
        )}
      </div>
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
