import { Select } from '@digdir/design-system-react';
import React from 'react';

import { Option } from '../../../types';
import { LoadingTableProps } from '../../types';

const PageSizeSelection = ({ table, loading }: LoadingTableProps) => {
  const options: Option[] = ['10', '25', '50', '100'].map((pageSize) => ({
    label: pageSize,
    value: pageSize,
  }));

  return (
    <div className="pagination-container__pagination-select-wrapper">
      <label htmlFor="pagination-select">Rader per side</label>
      <div className="pagination-select">
        <Select
          inputId="pagination-select"
          value={String(table.getState().pagination.pageSize)}
          onChange={(size) => {
            table.setPageSize(Number(size));
          }}
          options={options}
          disabled={loading}
          label="Rader per side"
          hideLabel={true}
        />
      </div>
    </div>
  );
};

export default PageSizeSelection;
