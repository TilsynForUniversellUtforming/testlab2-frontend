import { CellCheckboxId } from '@common/table/types';
import { Table as DSTable } from '@digdir/designsystemet-react';
import { TableHeaderCellProps } from '@digdir/designsystemet-react/dist/types/components/Table/TableHeaderCell';
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

  if (!column.getCanSort() || loading) {
    const isCheckbox = header.id === CellCheckboxId;
    if (loading && isCheckbox) {
      return (
        <DSTable.HeaderCell
          colSpan={header.colSpan}
          style={{ width: `3rem` }}
        ></DSTable.HeaderCell>
      );
    }

    return (
      <DSTable.HeaderCell
        colSpan={header.colSpan}
        style={{ width: isCheckbox ? `3rem` : 'auto' }}
      >
        {flexRender(column.columnDef.header, header.getContext())}
      </DSTable.HeaderCell>
    );
  }

  let sortDirection: TableHeaderCellProps['sort'] | undefined = undefined;
  if (header.column?.getIsSorted() === 'asc') {
    sortDirection = 'ascending';
  }
  if (header.column?.getIsSorted() === 'desc') {
    sortDirection = 'descending';
  }

  return (
    <>
      <DSTable.HeaderCell
        onSortClick={header.column.getToggleSortingHandler()}
        sort={sortDirection}
        colSpan={header.colSpan}
        sortable={column.getCanSort()}
      >
        {flexRender(header.column.columnDef.header, header.getContext())}
      </DSTable.HeaderCell>
    </>
  );
};

export default TestlabTableHeader;
