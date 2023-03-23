import { SortDirection, TableCell } from '@digdir/design-system-react';
import { flexRender, Header } from '@tanstack/react-table';
import React from 'react';

export interface Props<T> {
  header: Header<T, unknown>;
  loading: boolean;
}

const TestlabTableHeader = <T extends object>({
  header,
  loading,
}: Props<T>) => {
  if (header.isPlaceholder) {
    return null;
  }

  const column = header.column;

  if (!column.getCanSort()) {
    const size: number | undefined = column.columnDef.size;
    const width = size ? `${3 * size}rem` : 'auto';

    return (
      <TableCell colSpan={header.colSpan} style={{ width: width }}>
        {flexRender(column.columnDef.header, header.getContext())}
      </TableCell>
    );
  }

  let sortDirection: SortDirection = 'notActive';
  if (header.column?.getIsSorted() === 'asc') {
    sortDirection = 'asc';
  }
  if (header.column?.getIsSorted() === 'desc') {
    sortDirection = 'desc';
  }

  return (
    <>
      <TableCell
        onChange={header.column.getToggleSortingHandler()}
        sortDirection={sortDirection}
        disabled={loading}
        colSpan={header.colSpan}
      >
        {flexRender(header.column.columnDef.header, header.getContext())}
      </TableCell>
    </>
  );
};

export default TestlabTableHeader;
