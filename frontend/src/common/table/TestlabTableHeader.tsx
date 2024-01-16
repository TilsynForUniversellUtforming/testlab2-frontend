import TableFilterSelect from '@common/table/control/filter/TableFilterSelect';
import {
  LegacySortDirection,
  LegacyTableCell,
} from '@digdir/design-system-react';
import { flexRender, Header, Table } from '@tanstack/react-table';
import React from 'react';

export interface Props<T> {
  table: Table<T>;
  header: Header<T, unknown>;
  loading: boolean;
}

const TestlabTableHeader = <T extends object>({
  table,
  header,
  loading,
}: Props<T>) => {
  if (header.isPlaceholder) {
    return null;
  }

  const column = header.column;

  if (!column.getCanSort() || loading) {
    const size: number | undefined = column.columnDef.size;
    const width = size ? `${3 * size}rem` : 'auto';

    return (
      <LegacyTableCell colSpan={header.colSpan} style={{ width: width }}>
        {flexRender(column.columnDef.header, header.getContext())}
      </LegacyTableCell>
    );
  }

  let sortDirection: LegacySortDirection = 'notActive';
  if (header.column?.getIsSorted() === 'asc') {
    sortDirection = 'asc';
  }
  if (header.column?.getIsSorted() === 'desc') {
    sortDirection = 'desc';
  }

  if (column.columnDef?.meta?.select && column.getCanFilter()) {
    return (
      <TableFilterSelect
        table={table}
        header={header}
        sortDirection={sortDirection}
      />
    );
  }

  return (
    <>
      <LegacyTableCell
        onChange={header.column.getToggleSortingHandler()}
        sortDirection={sortDirection}
        disabled={loading}
        colSpan={header.colSpan}
      >
        {flexRender(header.column.columnDef.header, header.getContext())}
      </LegacyTableCell>
    </>
  );
};

export default TestlabTableHeader;
