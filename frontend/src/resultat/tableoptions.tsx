import { fuzzyFilter } from '@common/table/util';
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowSelectionState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { TableOptions } from '@tanstack/table-core';
import { useState } from 'react';

// eslint-disable-next-line
const exactTextFilterFn: FilterFn<any> = (row, columnId, value) => {
  const rowValue = row.getValue(columnId);
  return rowValue === value;
};
export function resultTable<T>(
  data: T[],
  columns: ColumnDef<T>[],
  columnVisibility: VisibilityState,
  setColumnVisibility: (
    value: ((prevState: VisibilityState) => VisibilityState) | VisibilityState
  ) => void,
  selectedRows: boolean[] = []
) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    selectedRows.reduce((acc, b, index) => ({ ...acc, [index]: b }), {})
  );

  const rowSelectionEnabled = false;

  const handleRowSelection = (rss: RowSelectionState) => {
    setRowSelection(rss);
  };

  const tableOptions: TableOptions<T> = {
    data: data,
    columns: columns,
    filterFns: {
      fuzzy: fuzzyFilter,
      exact: exactTextFilterFn,
    },
    state: {
      columnFilters,
      rowSelection,
      columnVisibility,
    },
    enableRowSelection: rowSelectionEnabled,
    enableMultiRowSelection: rowSelectionEnabled,
    onRowSelectionChange: (updaterOrValue) => {
      if (typeof updaterOrValue === 'function') {
        handleRowSelection(updaterOrValue(rowSelection));
      } else {
        handleRowSelection(updaterOrValue);
      }
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    autoResetPageIndex: false,
    getExpandedRowModel: getExpandedRowModel(),
    autoResetExpanded: false,
    // eslint-disable-next-line
    getSubRows: (row: any) => {
      // eslint-disable-next-line
      return row.loeysingar;
    },
    maxLeafRowFilterDepth: 0,
  };

  return useReactTable(tableOptions);
}
