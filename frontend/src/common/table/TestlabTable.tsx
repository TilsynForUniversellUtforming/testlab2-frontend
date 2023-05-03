import './testlabTable.scss';

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

import ErrorCard, { TestlabError } from '../error/ErrorCard';
import ControlHeader from './control/ControlHeader';
import TableFilter from './control/filter/TableFilter';
import PaginationContainer from './control/pagination/PaginationContainer';
import TestlabTableBody from './TestlabTableBody';
import TestlabTableHeader from './TestlabTableHeader';
import { TableFilterPreference, TableStyle } from './types';

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

export interface TestlabTableProps<T extends object> {
  data: T[];
  defaultColumns: ColumnDef<T>[];
  displayError?: TestlabError;
  inputError?: string;
  loading?: boolean;
  filterPreference?: TableFilterPreference;
  selectedRows?: boolean[];
  onSelectRows?: (rows: T[]) => void; // Funksjon for row selection, implisitt selectable row
  disableMultiRowSelection?: boolean;
  onClickRetry?: () => void;
  customStyle?: TableStyle;
}

/**
 * A TanStack table component for displaying and manipulating data.
 *
 * @template T - The type of data displayed in the table.
 * @param {object} props - The props for the component.
 * @param {T[]} props.data - The data to be displayed in the table.
 * @param {ColumnDef<T>[]} props.defaultColumns - The default columns to display in the table.
 * @param {TestlabError} props.displayError - The error to show in the error card.
 * @param {string} [props.inputError] - Any error that occurred during user input.
 * @param {boolean} [props.loading=false] - Whether the table is currently loading data.
 * @param {FilterPreference} [props.filterPreference='all'] - The default filter preference.
 * @param {boolean[]} [props.selectedRows=[]] - An array indicating which rows are selected.
 * @param {(rows: T[]) => void} [props.onSelectRows] - A function to be called when rows are selected. If defined the row selection is implicitly active
 * @param {boolean} [props.disableMultiRowSelection=false] - Whether the user can select multiple rows
 * @param {() => void} [props.onClickRetry] - A function to be called when the user clicks the retry button.
 * @param {Style} [props.customStyle={ full: true, small: false, fixed: false }] - The custom styles to apply to the table.
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
}: TestlabTableProps<T>) => {
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
    enableMultiRowSelection: enableRowSelection && !disableMultiRowSelection,
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
  const headerRow = table.getPreFilteredRowModel().flatRows[0];
  const showFilters =
    filterPreference !== 'none' && filterPreference !== 'searchbar';

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
          {showFilters && (
            <TableRow>
              {headerGroup.headers.map((header) => (
                <TableFilter
                  headerRow={headerRow}
                  column={header.column}
                  key={header.column.id}
                />
              ))}
            </TableRow>
          )}
        </TableHeader>
        <TableBody>
          <TestlabTableBody table={table} loading={loading} />
        </TableBody>
        <TableFooter>
          <TableRow>
            <PaginationContainer table={table} loading={loading} />
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default TestlabTable;
