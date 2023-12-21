import { LoadingTableProps } from '@common/table/types';
import { Combobox } from '@digdir/design-system-react';
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
        <Combobox
          label="Rader per side"
          value={[String(table.getState().pagination.pageSize)]}
          onValueChange={(selection) => table.setPageSize(Number(selection[0]))}
          disabled={loading}
          hideLabel
          id={tableId}
          size="small"
        >
          {['10', '25', '50', '100'].map((pageSize) => (
            <Combobox.Option value={pageSize} key={pageSize}>
              {pageSize}
            </Combobox.Option>
          ))}
        </Combobox>
      </div>
    </div>
  );
};

export default PageSizeSelection;
