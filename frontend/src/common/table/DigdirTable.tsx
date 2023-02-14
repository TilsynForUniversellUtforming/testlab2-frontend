import './digdirTable.scss';
import 'react-loading-skeleton/dist/skeleton.css';

import { RankingInfo, rankItem } from '@tanstack/match-sorter-utils';
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
  RowSelectionState,
  useReactTable,
} from '@tanstack/react-table';
import classNames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';

import ErrorCard from '../error/ErrorCard';
import HideWhenLoading from '../HideWhenLoading';
import ControlHeader from './control/ControlHeader';
import PaginationContainer from './control/pagination/PaginationContainer';
import TableBody from './TableBody';
import TableHeader from './TableHeader';

export interface Style {
  full?: boolean;
  small?: boolean;
  fixed?: boolean;
}

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

interface Props<T extends object> {
  data: T[];
  defaultColumns: ColumnDef<T>[];
  error: any;
  loading?: boolean;
  showFilters?: boolean;
  onSelectRows?: (rows: T[]) => void; // Funksjon for row selection, implisitt selectable row
  onClickRetry?: () => void;
  customStyle?: Style;
}

const DigdirTable = <T extends object>({
  data,
  defaultColumns,
  error,
  loading = false,
  showFilters = true,
  onSelectRows,
  onClickRetry,
  customStyle = {
    fixed: false,
    small: false,
    full: true,
  },
}: Props<T>) => {
  const [columns] = useState<typeof defaultColumns>(() => [...defaultColumns]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const enableRowSelection = typeof onSelectRows !== 'undefined';

  const handleRowSelection = (rss: RowSelectionState) => {
    setRowSelection(rss);
  };

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
      rowSelection,
    },
    enableRowSelection: enableRowSelection,
    onRowSelectionChange: (updaterOrValue) => {
      if (typeof updaterOrValue === 'function') {
        handleRowSelection(updaterOrValue(rowSelection));
      } else {
        handleRowSelection(updaterOrValue);
      }
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
  });

  useEffect(() => {
    if (enableRowSelection) {
      const selectedRows = table
        .getSelectedRowModel()
        .flatRows.map((fr) => fr.original);
      onSelectRows(selectedRows);
    }
  }, [rowSelection, enableRowSelection]);

  const onChangeGlobalFilter = useCallback((value: string | number) => {
    setGlobalFilter(String(value));
  }, []);

  if (error) {
    return <ErrorCard show={error} onClickRetry={onClickRetry} />;
  }

  return (
    <div className="p-2 digdir-table">
      <ControlHeader
        loading={loading}
        showFilters={showFilters}
        table={table}
        filterValue={globalFilter}
        onChangeFilter={onChangeGlobalFilter}
        small={customStyle.small}
      />
      <Table
        className={classNames('digdir-table', {
          full: customStyle.full,
          fixed: customStyle.fixed,
          sm: customStyle.small,
          bordered: customStyle.small,
        })}
        hover={enableRowSelection}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHeader
                  key={header.id}
                  table={table}
                  header={header}
                  showFilters={showFilters}
                  loading={loading}
                />
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          <TableBody table={table} loading={loading} />
        </tbody>
      </Table>
      <div className="h-2" />
      <HideWhenLoading loading={loading}>
        <PaginationContainer table={table} />
      </HideWhenLoading>
    </div>
  );
};

export default DigdirTable;
