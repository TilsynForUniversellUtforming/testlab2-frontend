import { LoadingTableProps } from '@common/table/types';
import { NativeSelect } from '@digdir/design-system-react';
import React from 'react';

const PageSizeSelection = <T extends object>({
  table,
  loading,
}: LoadingTableProps<T>) => {
  const tableId = table
    .getFlatHeaders()
    .map((h) => h.id)
    .join();

  return (
    <div className="pagination-container__pagination-select-wrapper">
      <label htmlFor={tableId}>Rader per side</label>
      <div className="pagination-select">
        <NativeSelect
          label="Rader per side"
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.currentTarget.value))}
          disabled={loading}
          hideLabel
          id={tableId}
          size="small"
          htmlSize={1}
        >
          {['10', '25', '50', '100'].map((pageSize) => (
            <option value={pageSize} key={pageSize}>
              {pageSize}
            </option>
          ))}
        </NativeSelect>
      </div>
    </div>
  );
};

export default PageSizeSelection;
