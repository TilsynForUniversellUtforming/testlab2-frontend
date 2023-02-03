import { Table } from '@tanstack/react-table';
import React from 'react';
import { Stack } from 'react-bootstrap';

import DebouncedInput from '../../DebouncedInput';
import PageSizeSelection from './pagination/PageSizeSelection';

export interface Props {
  loading: boolean;
  table: Table<any>;
  showFilters: boolean;
  filterValue: string;
  onChangeFilter: (value: string | number) => void;
  small?: boolean;
}

const ControlHeader = ({
  loading,
  table,
  showFilters,
  filterValue,
  onChangeFilter,
  small = false,
}: Props) => {
  if (small) {
    return null;
  }

  return (
    <Stack direction="horizontal" gap={2}>
      <div>
        <PageSizeSelection table={table} loading={loading} />
      </div>
      {showFilters && (
        <div>
          <DebouncedInput
            value={filterValue}
            onChange={onChangeFilter}
            className="p-2 font-lg shadow border border-block"
            placeholder="Search all columns..."
          />
        </div>
      )}
    </Stack>
  );
};

export default ControlHeader;
