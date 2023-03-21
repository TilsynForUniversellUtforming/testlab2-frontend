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
    <Select
      label="Elementer per side"
      value={String(table.getState().pagination.pageSize)}
      onChange={(size) => {
        table.setPageSize(Number(size));
      }}
      options={options}
      disabled={loading}
    />
  );
};

export default PageSizeSelection;
