import { fuzzyFilter } from '@common/table/util';
import {
  ColumnDef,
  ColumnFilter,
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

// eslint-disable-next-line
const exactTextFilterFn: FilterFn<any> = (row, columnId, value) => {
  const rowValue = row.getValue(columnId);
  return rowValue === value;
};
export function resultTable<T>(
  data: T[],
  columns: ColumnDef<T>[],
  columnFilters: ColumnFilter[],
  rowSelection: RowSelectionState,
  columnVisibility: VisibilityState,
  rowSelectionEnabled: boolean,
  handleRowSelection: (rss: RowSelectionState) => void,
  setColumnFilters: (
    value: ((prevState: ColumnFilter[]) => ColumnFilter[]) | ColumnFilter[]
  ) => void,
  setColumnVisibility: (
    value: ((prevState: VisibilityState) => VisibilityState) | VisibilityState
  ) => void
) {
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
