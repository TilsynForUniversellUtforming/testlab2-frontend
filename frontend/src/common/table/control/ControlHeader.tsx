import { Table } from '@tanstack/react-table';
import React from 'react';

import DebouncedInput from '../../DebouncedInput';
import TableActionDropdown from '../../dropdown/TableActionDropdown';
import { TableFilterPreference, TableRowAction } from '../types';

export interface Props {
  loading: boolean;
  table: Table<any>;
  filterPreference: TableFilterPreference;
  filterValue: string;
  onChangeFilter: (value: string | number) => void;
  rowActions?: TableRowAction[];
  rowActionEnabled: boolean;
  small?: boolean;
}

const ControlHeader = ({
  table,
  filterPreference,
  filterValue,
  onChangeFilter,
  rowActions,
  rowActionEnabled,
  small = false,
}: Props) => {
  const tableElementSize = table.getPreFilteredRowModel().flatRows.length;
  const hasElements = tableElementSize > 0;

  const showFilters =
    !small &&
    filterPreference !== 'none' &&
    filterPreference !== 'rowsearch' &&
    hasElements;

  return (
    <div className="control-header">
      {rowActions && rowActions.length > 0 && (
        <TableActionDropdown
          actions={rowActions}
          disabled={!rowActionEnabled}
          table={table}
        />
      )}
      <div className="control-header__input">
        {showFilters && (
          <DebouncedInput
            label="Søk"
            value={filterValue}
            onChange={onChangeFilter}
          />
        )}
      </div>
    </div>
  );
};

export default ControlHeader;
