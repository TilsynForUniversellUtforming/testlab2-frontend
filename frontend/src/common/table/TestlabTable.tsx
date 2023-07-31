import './testlabTable.scss';
import '@tanstack/react-table';

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
  Row,
  RowSelectionState,
  useReactTable,
} from '@tanstack/react-table';
import { TableOptions } from '@tanstack/table-core';
import React, { useCallback, useEffect, useState } from 'react';

import ErrorCard, { TestlabError } from '../error/ErrorCard';
import { isDefined } from '../util/util';
import ControlHeader from './control/ControlHeader';
import TableFilter from './control/filter/TableFilter';
import PaginationContainer from './control/pagination/PaginationContainer';
import TestlabTableBody from './TestlabTableBody';
import TestlabTableHeader from './TestlabTableHeader';
import { TableFilterPreference, TableRowAction, TableStyle } from './types';

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
    exact: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

/*
ColumnMeta is extended to include the select property,
which is used to indicate whether a column should use a select component instead of input
*/
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    select?: boolean;
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

const exactTextFilterFn: FilterFn<any> = (row, columnId, value) => {
  const rowValue = row.getValue(columnId);
  return rowValue === value;
};

export interface TestlabTableProps<T extends object> {
  data: T[];
  defaultColumns: ColumnDef<T>[];
  displayError?: TestlabError;
  loading?: boolean;
  filterPreference?: TableFilterPreference;
  selectedRows?: boolean[];
  onSelectRows?: (rows: T[]) => void; // Funksjon for row selection, implisitt selectable row
  disableMultiRowSelection?: boolean;
  onClickRetry?: () => void;
  customStyle?: TableStyle;
  rowActions?: TableRowAction[];
  loadingStateStatus?: string;
  onClickCallback?: (row?: Row<T>) => void;
}

/**
 * A TanStack table component for displaying and manipulating data.
 *
 * @template T - The type of data displayed in the table.
 * @param {object} props - The props for the component.
 * @param {T[]} props.data - The data to be displayed in the table.
 * @param {ColumnDef<T>[]} props.defaultColumns - The default columns to display in the table.
 * @param {TestlabError} props.displayError - The error to show in the error card.
 * @param {boolean} [props.loading=false] - Whether the table is currently loading data.
 * @param {TableFilterPreference} [props.filterPreference='all'] - The default filter preference.
 * @param {boolean[]} [props.selectedRows=[]] - An array indicating which rows are selected.
 * @param {(rows: T[]) => void} [props.onSelectRows] - A function to be called when rows are selected. If defined the row selection is implicitly active
 * @param {boolean} [props.disableMultiRowSelection=false] - Whether the user can select multiple rows
 * @param {() => void} [props.onClickRetry] - A function to be called when the user clicks the retry button.
 * @param {TableStyle} [props.customStyle={ full: true, small: false, fixed: false }] - The custom styles to apply to the table.
 * @param {TableRowAction[]} [props.rowActions] - The actions that can be preformed on the table rows. Assumes that the table is selectable.
 * @param {string} [props.loadingStateStatus] - The status to display when the table is loading.
 * @param {(row?: Row<T>) => void} [props.onClickCallback] - A optional function to be called when a row is clicked. The clicked row's data will be passed as an argument to the function.
 * @returns {JSX.Element} - The React component for the TestlabTable.
 */
const TestlabTable = <T extends object>({
  data,
  defaultColumns,
  displayError,
  loading = false,
  filterPreference = 'all',
  selectedRows = [],
  onSelectRows,
  disableMultiRowSelection = false,
  onClickRetry,
  customStyle = {
    small: false,
  },
  rowActions,
  loadingStateStatus,
  onClickCallback,
}: TestlabTableProps<T>) => {
  const isLoading = loading ?? false;
  const [columns, setColumns] = useState<typeof defaultColumns>(() => [
    ...defaultColumns,
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    Object.assign({}, selectedRows) as unknown as RowSelectionState
  );

  const rowSelectionEnabled = typeof onSelectRows !== 'undefined';

  const handleRowSelection = (rss: RowSelectionState) => {
    setRowSelection(rss);
  };

  useEffect(() => {
    setColumns([...defaultColumns]);
  }, [defaultColumns]);

  const tableOptions: TableOptions<T> = {
    data: data,
    columns: columns,
    filterFns: {
      fuzzy: fuzzyFilter,
      exact: exactTextFilterFn,
    },
    state: {
      columnFilters,
      globalFilter,
      rowSelection,
    },
    enableRowSelection: rowSelectionEnabled,
    enableMultiRowSelection: rowSelectionEnabled && !disableMultiRowSelection,
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
    autoResetPageIndex: false,
  };

  const table = useReactTable(tableOptions);

  useEffect(() => {
    if (rowSelectionEnabled) {
      const selectedTableRows = table
        .getSelectedRowModel()
        .flatRows.map((fr) => fr.original);
      onSelectRows?.(selectedTableRows);
    }
  }, [rowSelection, rowSelectionEnabled]);

  const onChangeGlobalFilter = useCallback((value: string | number) => {
    setGlobalFilter(String(value));
  }, []);

  const handleClickRetry = () => {
    table.toggleAllRowsSelected(false);
    if (onClickRetry) {
      onClickRetry();
    }
  };

  if (displayError?.error) {
    return (
      <ErrorCard
        errorHeader={displayError.errorHeader}
        error={displayError.error}
        onClick={displayError.onClick ?? handleClickRetry}
        buttonText={displayError.buttonText ?? 'Prøv igjen'}
      />
    );
  }

  const headerGroup = table.getHeaderGroups()[0];
  const showFilters =
    filterPreference !== 'none' && filterPreference !== 'searchbar';

  return (
    <div className="testlab-table">
      <ControlHeader
        filterPreference={filterPreference ?? 'all'}
        table={table}
        filterValue={globalFilter}
        onChangeFilter={onChangeGlobalFilter}
        small={customStyle?.small}
        rowActionEnabled={rowSelectionEnabled && isDefined(rowSelection)}
        rowActions={rowActions}
        loadingStateStatus={loadingStateStatus}
      />
      <Table
        className="testlab-table__table"
        selectRows={typeof onClickCallback !== 'undefined'}
      >
        <TableHeader>
          <TableRow>
            {headerGroup.headers.map((header) => (
              <TestlabTableHeader<T>
                header={header}
                loading={isLoading}
                key={header.column.id}
              />
            ))}
          </TableRow>
          {showFilters && (
            <TableRow>
              {headerGroup.headers.map((header) => (
                <TableFilter<T>
                  table={table}
                  column={header.column}
                  key={header.column.id}
                />
              ))}
            </TableRow>
          )}
        </TableHeader>
        <TableBody>
          <TestlabTableBody<T>
            table={table}
            loading={isLoading}
            onClickCallback={onClickCallback}
          />
        </TableBody>
        <TableFooter>
          <TableRow>
            <PaginationContainer table={table} loading={isLoading} />
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default TestlabTable;
