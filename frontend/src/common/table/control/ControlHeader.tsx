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
}

const ControlHeader = ({
  loading,
  table,
  showFilters,
  filterValue,
  onChangeFilter,
}: Props) => (
  <Stack direction="horizontal" gap={2} className="pb-4">
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

export default ControlHeader;
