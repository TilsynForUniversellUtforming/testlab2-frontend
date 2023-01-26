import './digdirTable.scss';
import 'react-loading-skeleton/dist/skeleton.css';

import {
  compareItems,
  RankingInfo,
  rankItem,
} from '@tanstack/match-sorter-utils';
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
  SortingFn,
  sortingFns,
  useReactTable,
} from '@tanstack/react-table';

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

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0;

  // Only sort by rank if the column has ranking information
  if (
    rowA?.columnFiltersMeta[columnId] !== null &&
    typeof rowA?.columnFiltersMeta[columnId] !== 'undefined'
  ) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId].itemRank,
      rowB.columnFiltersMeta[columnId].itemRank
    );
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

import React, { useCallback, useState } from 'react';
import Table from 'react-bootstrap/Table';

import HideWhenLoading from '../HideWhenLoading';
import ControlHeader from './control/ControlHeader';
import PaginationContainer from './control/pagination/PaginationContainer';
import TableError from './error/TableError';
import TableBody from './TableBody';
import TableHeader from './TableHeader';

interface Props {
  data: any[];
  defaultColumns: ColumnDef<any>[];
  error: any;
  loading: boolean;
  showFilters: boolean;
  onClickRetry: () => void;
}

const DigdirTable = ({
  data,
  defaultColumns,
  error,
  loading,
  showFilters,
  onClickRetry,
}: Props) => {
  const [columns] = useState<typeof defaultColumns>(() => [...defaultColumns]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
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

  const [state, setState] = useState(table.initialState);

  table.setOptions((prev) => ({
    ...prev,
    state,
    onStateChange: setState,
  }));

  const onChangeGlobalFilter = useCallback((value: string | number) => {
    setGlobalFilter(String(value));
  }, []);

  if (error) {
    return <TableError show={error} onClickRetry={onClickRetry} />;
  }

  return (
    <div className="p-2 digdir-table">
      <ControlHeader
        loading={loading}
        showFilters={showFilters}
        table={table}
        filterValue={globalFilter}
        onChangeFilter={onChangeGlobalFilter}
      />
      <Table bordered className="digdir-table">
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
