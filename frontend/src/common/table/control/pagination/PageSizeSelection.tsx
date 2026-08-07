import { LoadingTableProps } from '@common/table/types';
import { Select } from '@digdir/designsystemet-react';
import React, { ChangeEvent } from 'react';

const PageSizeSelection = <T extends object>({
  table,
  loading,
  paginationHander
}: LoadingTableProps<T>) => {
  const tableId = table
    .getFlatHeaders()
    .map((h) => h.id)
    .join();


  const onChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (paginationHander) {
      paginationHander({
        pageIndex: table.getState().pagination.pageIndex,
        pageSize: Number(event.currentTarget.value),
      });
    } else {
      table.setPageSize(Number(event.currentTarget.value));
    }
  }

  return (
    <div className="pagination-container__pagination-select-wrapper">
      <label htmlFor={tableId}>Rader per side</label>
      <div className="pagination-select">
        <Select
          aria-label="Rader per side"
          value={table.getState().pagination.pageSize}
          onChange={onChange}
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
