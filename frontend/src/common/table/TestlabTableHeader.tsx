import { CellCheckboxId } from '@common/table/types';
import {
  Table as DSTable,
  TableHeaderCellProps,
} from '@digdir/designsystemet-react';
import { flexRender, Header } from '@tanstack/react-table';
import React from 'react';

export interface Props<T> {
  header: Header<T, unknown>;
  loading: boolean;
  sortingHandler?:  () => undefined | ((event: unknown) => void)
}

function getSortDirection<T>(header: Header<T, unknown>) {
  let sortDirection: TableHeaderCellProps['sort'] | undefined = undefined;
  if (header.column?.getIsSorted() === 'asc') {
    sortDirection = 'ascending';
  }
  if (header.column?.getIsSorted() === 'desc') {
    sortDirection = 'descending';
  }
  return sortDirection;
}

function getToggleSortingHandler<T>(header: Header<T, unknown>) {
  return header.column.getToggleSortingHandler();
}


function columnIsSortable<T>(header: Header<T, unknown>) {
  return header.column.getCanSort();
}

const getHeaderContent = <T extends object>(header: Header<T, unknown>) => {
  return flexRender(header.column.columnDef.header, header.getContext());
}

function isCheckbox<T>(header: Header<T, unknown>) {
  return header.id === CellCheckboxId;
}


function showEmptyHeader<T>(loading: boolean, header: Header<T, unknown>) {
  return loading && isCheckbox(header);
}

function showWithoutSorting<T>( loading: boolean , header: Header<T, unknown>,) {
  return !columnIsSortable(header) || loading;
}

const TestlabTableHeader = <T extends object>({
  header,
  loading,
  sortingHandler
}: Props<T>) => {
  if (header.isPlaceholder) {
    return null;
  }


  const headerContent = getHeaderContent(header);
  const colSpan = header.colSpan;

  const handleSort: React.MouseEventHandler<HTMLTableCellElement> = (e) => {
    e.preventDefault();
    const toggleSortingHandler = sortingHandler || getToggleSortingHandler(header);
    if (toggleSortingHandler) {
      toggleSortingHandler(e);
    }
  };


  if (showEmptyHeader(loading, header)) {
    return (
      <DSTable.HeaderCell
        colSpan={colSpan}
        style={{ width: `3rem` }}
      ></DSTable.HeaderCell>
    );
  }


  if (showWithoutSorting(loading,header)) {
    return (
      <DSTable.HeaderCell
        colSpan={colSpan}
        style={{ width: isCheckbox(header) ? `3rem` : 'auto' }}
      >
        {headerContent}
      </DSTable.HeaderCell>
    );
  }


  return (
      <DSTable.HeaderCell
        onClick={handleSort}
        sort={getSortDirection(header)}
        colSpan={colSpan}
      >
        {headerContent}
      </DSTable.HeaderCell>
  );
};

export default TestlabTableHeader;
