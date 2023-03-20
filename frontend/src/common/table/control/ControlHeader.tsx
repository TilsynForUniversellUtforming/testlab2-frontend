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
    <div className="pb-4">
      <div>
        {/*sm={4}*/}
        <div>
          <PageSizeSelection table={table} loading={loading} />
        </div>
        <div
          // sm={{ span: 4, offset: 4 }}
          className="d-flex justify-content-center align-items-end"
        >
          {showFilters && (
            <DebouncedInput
              value={filterValue}
              onChange={onChangeFilter}
              placeholder="Søk..."
              className="h-25"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ControlHeader;
