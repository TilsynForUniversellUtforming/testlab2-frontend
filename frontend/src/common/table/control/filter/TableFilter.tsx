import { TableCell } from '@digdir/design-system-react';
import { Column } from '@tanstack/react-table';
import React from 'react';

import TableFilterInput from './TableFilterInput';

export interface Props<T> {
  column: Column<T>;
}

const TableFilter = <T extends object>({ column }: Props<T>) => {
  return (
    <TableCell>
      <TableFilterInput column={column} />
    </TableCell>
  );
};

export default TableFilter;
