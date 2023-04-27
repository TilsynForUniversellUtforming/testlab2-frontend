import { Table } from '@tanstack/react-table';
import React from 'react';

import DebouncedInput from '../../DebouncedInput';
import { TableFilterPreference } from '../types';
import PageSizeSelection from './pagination/PageSizeSelection';

export interface Props {
  loading: boolean;
  table: Table<any>;
  filterPreference: TableFilterPreference;
  filterValue: string;
  onChangeFilter: (value: string | number) => void;
  small?: boolean;
}

const ControlHeader = ({
  loading,
  table,
  filterPreference,
  filterValue,
  onChangeFilter,
  small = false,
}: Props) => {
  if (small) {
    return null;
  }

  const showFilters =
    filterPreference !== 'none' &&
    filterPreference !== 'rowsearch' &&
    hasElements;

  return (
    <div className="control-header">
      {displayPageSizeSelection && (
        <div className="control-header__size-selection">
          <PageSizeSelection table={table} loading={loading} />
        </div>
      )}
      <div className="control-header__input">
        {showFilters && (
          <DebouncedInput
            label="Fritt søk"
            value={filterValue}
            onChange={onChangeFilter}
            placeholder="Søk..."
          />
        )}
      </div>
    </div>
  );
};

export default ControlHeader;
