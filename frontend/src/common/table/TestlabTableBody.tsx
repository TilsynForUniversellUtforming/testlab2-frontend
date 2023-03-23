import { TableCell, TableRow } from '@digdir/design-system-react';
import { flexRender } from '@tanstack/react-table';
import React from 'react';

import TableSkeleton from './skeleton/TableSkeleton';
import { LoadingTableProps } from './types';

const TestlabTableBody = ({ loading, table }: LoadingTableProps) => {
  if (loading) {
    return <TableSkeleton table={table} />;
  }

  return (
    <>
      {table.getRowModel().rows.map((row) => (
        <TableRow key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

export default TestlabTableBody;
