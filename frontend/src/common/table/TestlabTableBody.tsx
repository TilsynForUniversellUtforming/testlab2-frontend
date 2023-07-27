import { TableCell, TableRow } from '@digdir/design-system-react';
import { flexRender, Row } from '@tanstack/react-table';
import React from 'react';

import TableSkeleton from './skeleton/TableSkeleton';
import { CellCheckboxId, LoadingTableProps } from './types';

export interface TableBodyProps<T> extends LoadingTableProps {
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
        <TableRow key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <TableCell
              key={cell.id}
              onClick={() => onRowClick(row, cell.id.includes(CellCheckboxId))}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

export default TestlabTableBody;
