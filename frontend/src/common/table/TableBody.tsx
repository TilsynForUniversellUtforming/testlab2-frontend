import { flexRender } from '@tanstack/react-table';
import React from 'react';

import TableSkeleton from './skeleton/TableSkeleton';
import { LoadingTableProps } from './types';

const TableBody = ({ loading, table }: LoadingTableProps) => {
  if (loading) {
    return <TableSkeleton table={table} />;
  }

  return (
    <>
      {table.getRowModel().rows.map((row) => (
        <tr key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <td key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default TableBody;
