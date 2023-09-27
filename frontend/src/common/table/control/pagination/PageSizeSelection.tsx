import { LoadingTableProps } from '@common/table/types';
import { Option } from '@common/types';
import { Select } from '@digdir/design-system-react';
import React from 'react';

const PageSizeSelection = <T extends object>({
  table,
  loading,
}: LoadingTableProps<T>) => {
  const options: Option[] = ['10', '25', '50', '100'].map((pageSize) => ({
    label: pageSize,
    value: pageSize,
  }));

  const tableId = table
    .getFlatHeaders()
    .map((h) => h.id)
    .join();

  return (
    <div className="pagination-container__pagination-select-wrapper">
      <label htmlFor={tableId}>Rader per side</label>
      <div className="pagination-select">
        <Select
          inputId={tableId}
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
