import './testlabTable.scss';
import 'react-loading-skeleton/dist/skeleton.css';

import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableRow,
} from '@digdir/design-system-react';
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
import React, { useCallback, useEffect, useState } from 'react';

import ErrorCard from '../error/ErrorCard';
import HideWhenLoading from '../HideWhenLoading';
import ControlHeader from './control/ControlHeader';
import TableFilter from './control/filter/TableFilter';
import PaginationContainer from './control/pagination/PaginationContainer';
import TestlabTableBody from './TestlabTableBody';
import TestlabTableHeader from './TestlabTableHeader';

export interface Style {
  full?: boolean;
  small?: boolean;
  fixed?: boolean;
}

export type FilterPreference = 'all' | 'none' | 'searchbar' | 'rowsearch';

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
  filterPreference?: FilterPreference;
  selectedRows?: boolean[];
  onSelectRows?: (rows: T[]) => void; // Funksjon for row selection, implisitt selectable row
  onClickRetry?: () => void;
  customStyle?: Style;
}

const TestlabTable = <T extends object>({
  data,
  defaultColumns,
  error,
  loading = false,
  filterPreference = 'all',
  selectedRows = [],
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
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    Object.assign({}, selectedRows) as unknown as RowSelectionState
  );

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
    return <ErrorCard show={error} onClick={onClickRetry} />;
  }

  const headerGroup = table.getHeaderGroups()[0];
  const headerRow = table.getPreFilteredRowModel().flatRows[0];

  return (
    <div className="testlab-table">
      <ControlHeader
        loading={loading}
        filterPreference={filterPreference}
        table={table}
        filterValue={globalFilter}
        onChangeFilter={onChangeGlobalFilter}
        small={customStyle.small}
      />
      <Table className="testlab-table__table">
        <TableHeader>
          <TableRow>
            {headerGroup.headers.map((header) => (
              <TestlabTableHeader
                header={header}
                loading={loading}
                key={header.column.id}
              />
            ))}
          </TableRow>
          <TableRow>
            {headerGroup.headers.map((header) => (
              <TableFilter
                headerRow={headerRow}
                column={header.column}
                filterPreference={filterPreference}
                key={header.column.id}
              />
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TestlabTableBody table={table} loading={loading} />
        </TableBody>
        <HideWhenLoading loading={loading}>
          <TableFooter>
            <TableRow>
              <PaginationContainer table={table} />
            </TableRow>
          </TableFooter>
        </HideWhenLoading>
      </Table>
    </div>
  );
};

export default TestlabTable;
