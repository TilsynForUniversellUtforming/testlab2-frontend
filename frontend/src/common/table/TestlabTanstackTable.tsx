import './testlabTable.scss';
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
  Table,
  ColumnFilter,
} from '@tanstack/react-table';

import { ErrorSummary } from '@digdir/designsystemet-react';
import { RankingInfo } from '@tanstack/match-sorter-utils';
import { TableOptions } from '@tanstack/table-core';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';

import ErrorCard, { TestlabError } from '../error/ErrorCard';
import { isDefined } from '../util/validationUtils';
import ControlHeader from './control/ControlHeader';
import {
  CellCheckboxId,
  TableFilterPreference,
  TableRowAction,
  TableStyle,
} from './types';
import { fuzzyFilter } from './util';
import { TestlabTable } from '@common/table/TestlabTable';

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
  // eslint-disable-next-line
  interface ColumnMeta<TData, TValue> {
    select?: boolean;
  }
}

// eslint-disable-next-line
const exactTextFilterFn: FilterFn<any> = (row, columnId, value) => {
  const rowValue = row.getValue(columnId);
  return rowValue === value;
};

export interface TestlabTableProps<T extends object> {
  data: T[];
  defaultColumns: ColumnDef<T>[];
  displayError?: TestlabError;
  actionRequiredError?: string;
  loading?: boolean;
  filterPreference?: TableFilterPreference;
  selectedRows?: boolean[];
  onSelectRows?: (rows: T[]) => void;
  onClickRow?: (row?: Row<T>) => void;
  onClickRetry?: () => void;
  customStyle?: TableStyle;
  rowActions?: TableRowAction[];
  classNames?: string[];
}

function getCheckboxColumns<T>(table: Table<T>) {
  return table.getAllColumns().map((col) => col.id === CellCheckboxId);
}

function getTableOptions<T extends object>(
  data: T[],
  columns: ColumnDef<T>[],
  columnFilters: ColumnFilter[],
  globalFilter: string,
  rowSelection: RowSelectionState,
  rowSelectionEnabled: boolean,
  handleRowSelection: (rss: RowSelectionState) => void,
  setColumnFilters: (
    value: ((prevState: ColumnFilter[]) => ColumnFilter[]) | ColumnFilter[]
  ) => void,
  setGlobalFilter: (value: ((prevState: string) => string) | string) => void
): TableOptions<T> {
  return {
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
    enableMultiRowSelection: rowSelectionEnabled,
    onRowSelectionChange: (
      updaterOrValue:
        | RowSelectionState
        | ((arg0: RowSelectionState) => RowSelectionState)
    ) => {
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
}

/**
 * A TanStack table component for displaying and manipulating data.
 *
 * @template T - The type of data displayed in the table.
 * @param {object} props - The props for the component.
 * @param {T[]} props.data - The data to be displayed in the table.
 * @param {ColumnDef<T>[]} props.defaultColumns - The default columns to display in the table.
 * @param {TestlabError} props.displayError - The error to show in the error card.
 * @param {string} props.actionRequiredError - Optional error message to display if a table requires a user action.
 * @param {boolean} [props.loading=false] - Whether the table is currently loading data.
 * @param {TableFilterPreference} [props.filterPreference='all'] - The default filter preference.
 * @param {boolean[]} [props.selectedRows=[]] - An array indicating which rows are selected.
 * @param {(rows: T[]) => void} [props.onSelectRows] - A function to be called when rows are selected. If defined the row selection is implicitly active
 * @param {(row?: Row<T>) => void} [props.onClickRow] - A optional function to be called when a row is clicked. The clicked row's data will be passed as an argument to the function.
 * @param {() => void} [props.onClickRetry] - A function to be called when the user clicks the retry button.
 * @param {TableStyle} [props.customStyle={ full: true, small: false, fixed: false }] - The custom styles to apply to the table.
 * @param {TableRowAction[]} [props.rowActions] - The actions that can be preformed on the table rows. Assumes that the table is selectable.
 * @returns {ReactElement} - The React component for the TestlabTable.
 */
const TestlabTanstackTable = <T extends object>({
  data,
  defaultColumns,
  displayError,
  actionRequiredError,
  loading = false,
  filterPreference = 'all',
  selectedRows,
  onSelectRows,
  onClickRow,
  onClickRetry,
  customStyle = {
    small: false,
  },
  rowActions,
  classNames,
}: TestlabTableProps<T>): ReactElement => {
  const isLoading = loading ?? false;
  const [columns, setColumns] = useState<typeof defaultColumns>(() => [
    ...defaultColumns,
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({
    ...selectedRows,
  } as unknown as RowSelectionState);

  const rowSelectionEnabled = typeof onSelectRows !== 'undefined';

  const handleRowSelection = (rss: RowSelectionState) => {
    setRowSelection(rss);
  };

  useEffect(() => {
    setColumns([...defaultColumns]);
  }, [defaultColumns]);

  const tableOptions: TableOptions<T> = getTableOptions(
    data,
    columns,
    columnFilters,
    globalFilter,
    rowSelection,
    rowSelectionEnabled,
    handleRowSelection,
    setColumnFilters,
    setGlobalFilter
  );

  const table = useReactTable(tableOptions);

  useEffect(() => {
    if (rowSelectionEnabled) {
      const selectedTableRows = table
        .getSelectedRowModel()
        .flatRows.map((fr) => fr.original);
      onSelectRows?.(selectedTableRows);
    }
  }, [rowSelection, rowSelectionEnabled]);

  useEffect(() => {
    if (isDefined(selectedRows)) {
      table.setRowSelection({
        ...selectedRows,
      } as unknown as RowSelectionState);
    }
  }, [selectedRows]);

  const onChangeGlobalFilter = useCallback((value: string) => {
    setGlobalFilter(value);
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

  const columnCheckboxes = getCheckboxColumns(table);

  return (
    <div className="testlab-table">
      <ControlHeader
        filterPreference={filterPreference ?? 'all'}
        table={table}
        onChangeFilter={onChangeGlobalFilter}
        small={customStyle?.small}
        rowActionEnabled={rowSelectionEnabled && isDefined(rowSelection)}
        rowActions={rowActions}
      />
      <TestlabTable
        classNames={classNames}
        actionRequiredError={actionRequiredError}
        headerGroup={headerGroup}
        loading={isLoading}
        columnIsCheckBox={columnCheckboxes}
        onClickRow={onClickRow}
        table={table}
      />
      {actionRequiredError && (
        <ErrorSummary data-size="sm">{actionRequiredError}</ErrorSummary>
      )}
    </div>
  );
};

export default TestlabTanstackTable;
