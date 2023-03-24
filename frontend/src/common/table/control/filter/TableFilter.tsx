import { TableCell } from '@digdir/design-system-react';
import { Column, Row } from '@tanstack/react-table';
import React from 'react';

import TableFilterInput from './TableFilterInput';

export interface Props<T> {
  headerRow?: Row<T>;
  column: Column<T>;
}

const TableFilter = <T extends object>({ headerRow, column }: Props<T>) => {
  return (
    <TableCell>
      <TableFilterInput column={column} headerRow={headerRow} />
    </TableCell>
  );
};

export default TableFilter;
