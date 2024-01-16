import { LegacyTableCell, LegacyTableRow } from '@digdir/design-system-react';
import { flexRender, Row } from '@tanstack/react-table';
import React from 'react';

import TableSkeleton from './skeleton/TableSkeleton';
import { CellCheckboxId, LoadingTableProps } from './types';

export interface TableBodyProps<T> extends LoadingTableProps<T> {
  onClickCallback?: (row?: Row<T>) => void;
}

const TestlabTableBody = <T extends object>({
  loading,
  table,
  onClickCallback,
}: TableBodyProps<T>) => {
  if (loading) {
    return <TableSkeleton table={table} />;
  }

  const onRowClick = (row: Row<T>, isCheckbox: boolean) => {
    if (typeof onClickCallback === 'undefined' || isCheckbox) {
      return;
    } else {
      onClickCallback(row);
    }
  };

  return (
    <>
      {table.getRowModel().rows.map((row) => (
        <LegacyTableRow key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <LegacyTableCell
              key={cell.id}
              onClick={() => onRowClick(row, cell.id.includes(CellCheckboxId))}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </LegacyTableCell>
          ))}
        </LegacyTableRow>
      ))}
    </>
  );
};

export default TestlabTableBody;
