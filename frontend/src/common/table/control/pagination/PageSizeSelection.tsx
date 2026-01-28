import { LoadingTableProps } from '@common/table/types';
import { Select } from '@digdir/designsystemet-react';
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
        <Select
          aria-label="Rader per side"
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.currentTarget.value))}
          disabled={loading}
          id={tableId}
          data-size="sm"
        >
          {['10', '25', '50', '100'].map((pageSize) => (
            <option value={pageSize} key={pageSize}>
              {pageSize}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default PageSizeSelection;
