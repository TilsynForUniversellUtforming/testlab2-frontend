import { TableCell } from '@digdir/design-system-react';
import { Column, Table } from '@tanstack/react-table';
import React from 'react';

import TableFilterInput from './TableFilterInput';

export interface Props<T> {
  table: Table<T>;
  column: Column<T>;
}

const TableFilter = <T extends object>({ table, column }: Props<T>) => {
  return (
    <TableCell>
      <TableFilterInput table={table} column={column} />
    </TableCell>
  );
};

export default TableFilter;
