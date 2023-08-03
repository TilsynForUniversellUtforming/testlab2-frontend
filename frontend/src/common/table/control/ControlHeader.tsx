import { Spinner } from '@digdir/design-system-react';
import { Table } from '@tanstack/react-table';
import React from 'react';

import DebouncedInput from '../../debounced-input/DebouncedInput';
import TableActionDropdown from '../../dropdown/TableActionDropdown';
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

  const showFilters =
    !small &&
    filterPreference !== 'none' &&
    filterPreference !== 'rowsearch' &&
    hasElements;

  const showRowActions = rowActions && rowActions.length > 0;

  return (
    <div className="control-header">
      <div className="testlab-table dropdown">
        {showRowActions && (
          <TableActionDropdown<T>
            actions={rowActions}
            disabled={!rowActionEnabled}
            table={table}
          />
        )}
      </div>
      <div className="control-header__search">
        {loadingStateStatus && (
          <>
            <b>Status: </b>
            {`${loadingStateStatus} `}
            <Spinner title={loadingStateStatus} size="small" />
          </>
        )}
      </div>
      <div className="control-header__input">
        {showFilters && (
          <DebouncedInput
            label="Søk"
            value={filterValue}
            onChange={onChangeFilter}
            labelPlacement="left"
            ariaLabel={'Søk i tabell'}
            id={'search-input'}
          />
        )}
      </div>
    </div>
  );
};

export default ControlHeader;
