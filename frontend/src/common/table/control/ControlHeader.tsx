import { Spinner } from '@digdir/design-system-react';
import { Table } from '@tanstack/react-table';
import classNames from 'classnames';
import React from 'react';

import DebouncedInput from '../../debounced-input/DebouncedInput';
import TableActionDropdown from '../../dropdown/TableActionDropdown';
import { TableFilterPreference, TableRowAction } from '../types';

export interface Props {
  table: Table<any>;
  filterPreference: TableFilterPreference;
  filterValue: string;
  onChangeFilter: (value: string | number) => void;
  rowActions?: TableRowAction[];
  rowActionEnabled: boolean;
  small?: boolean;
  loadingStateStatus?: string;
}

const ControlHeader = ({
  table,
  filterPreference,
  filterValue,
  onChangeFilter,
  rowActions,
  rowActionEnabled,
  small = false,
  loadingStateStatus,
}: Props) => {
  const tableElementSize = table.getPreFilteredRowModel().flatRows.length;
  const hasElements = tableElementSize > 0;

  const showFilters =
    !small &&
    filterPreference !== 'none' &&
    filterPreference !== 'rowsearch' &&
    hasElements;

  const showRowActions = rowActions && rowActions.length > 0;

  return (
    <div
      className={classNames('control-header', {
        'search-only': showFilters && !showRowActions,
      })}
    >
      {showRowActions && (
        <TableActionDropdown
          actions={rowActions}
          disabled={!rowActionEnabled}
          table={table}
        />
      )}
      {loadingStateStatus && (
        <div>
          <b>Status: </b>
          {`${loadingStateStatus}... `}
          <Spinner title={loadingStateStatus} size="small" />
        </div>
      )}
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
