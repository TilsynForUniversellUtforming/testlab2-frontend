import { Table } from '@tanstack/react-table';
import React from 'react';

import DebouncedInput from '../../DebouncedInput';
import { FilterPreference } from '../TestlabTable';
import PageSizeSelection from './pagination/PageSizeSelection';

export interface Props {
  loading: boolean;
  table: Table<any>;
  filterPreference: FilterPreference;
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
    filterPreference !== 'none' && filterPreference !== 'rowsearch';

  return (
    <div className="control-header">
      <div className="control-header__size-selection">
        <PageSizeSelection table={table} loading={loading} />
      </div>
      <div className="control-header__input">
        {showFilters && (
          <DebouncedInput
            label="Fritt søk"
            value={filterValue}
            onChange={onChangeFilter}
            placeholder="Søk..."
            className="h-25"
          />
        )}
      </div>
    </div>
  );
};

export default ControlHeader;
