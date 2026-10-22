import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  RowSelectionState,
  useReactTable,
} from '@tanstack/react-table';
import { RankingInfo } from '@tanstack/match-sorter-utils';
import { TableOptions } from '@tanstack/table-core';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

import { isDefined } from '../util/validationUtils';
import { fuzzyFilter } from './util';

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
    exact: FilterFn<unknown>;
  }

  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    select?: boolean;
  }
}

const exactTextFilterFn: FilterFn<any> = (row, columnId, value) => {
  const rowValue = row.getValue(columnId);
  return rowValue === value;
};

interface UseTestlabTableProps<T extends object> {
  data: T[];
  defaultColumns: ColumnDef<T>[];
  selectedRows?: boolean[];
  onSelectRows?: (rows: T[]) => void;
  onClickRetry?: () => void;
  filterPreference?: string;
}

export const useTestlabTable = <T extends object>({
  data,
  defaultColumns,
  selectedRows,
  onSelectRows,
  onClickRetry,
}: UseTestlabTableProps<T>) => {
  const [columns, setColumns] = useState<ColumnDef<T>[]>(() => [...defaultColumns]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({
    ...selectedRows,
  } as unknown as RowSelectionState);

  const rowSelectionEnabled = onSelectRows != null;
  const [searchParams, setSearchParams] = useSearchParams();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: Number(searchParams.get('page')) ? Number(searchParams.get('page')) - 1 : 0,
    pageSize: Number(searchParams.get('size')) || 10,
  });

  useEffect(() => {
    setSearchParams((prev) => {
      prev.set('page', String(pagination.pageIndex + 1));
      prev.set('size', String(pagination.pageSize));
      return prev;
    });
  }, [pagination, setSearchParams]);

  useEffect(() => {
    setColumns([...defaultColumns]);
  }, [defaultColumns]);

  const tableOptions: TableOptions<T> = {
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
      exact: exactTextFilterFn,
    },
    state: {
      columnFilters,
      globalFilter,
      rowSelection,
      pagination,
    },
    enableRowSelection: rowSelectionEnabled,
    enableMultiRowSelection: rowSelectionEnabled,
    onRowSelectionChange: (updaterOrValue) => {
      const nextValue =
        typeof updaterOrValue === 'function' ? updaterOrValue(rowSelection) : updaterOrValue;
      setRowSelection(nextValue);
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    autoResetPageIndex: false,
  };

  const table = useReactTable(tableOptions);

  useEffect(() => {
    if (!rowSelectionEnabled) return;
    onSelectRows?.(table.getSelectedRowModel().flatRows.map((row) => row.original));
  }, [rowSelection, rowSelectionEnabled, onSelectRows, table]);

  useEffect(() => {
    if (isDefined(selectedRows)) {
      table.setRowSelection({ ...selectedRows } as unknown as RowSelectionState);
    }
  }, [selectedRows, table]);

  const handleGlobalFilterChange = useCallback((value: string) => {
    setGlobalFilter(value);
  }, []);

  const handleRetry = useCallback(() => {
    table.toggleAllRowsSelected(false);
    onClickRetry?.();
  }, [table, onClickRetry]);

  return {
    table,
    headerGroup: table.getHeaderGroups()[0],
    pagination,
    setPagination,
    rowSelectionEnabled,
    rowSelection,
    handleGlobalFilterChange,
    handleRetry,
  };
};
