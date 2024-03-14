import './testlabTable.scss';
import '@tanstack/react-table';

import TestlabTableBody from '@common/table/TestlabTableBody';
import { ErrorMessage, Table } from '@digdir/design-system-react';
import { RankingInfo, rankings, rankItem } from '@tanstack/match-sorter-utils';
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  FilterMeta,
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
import classnames from 'classnames';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';

import ErrorCard, { TestlabError } from '../error/ErrorCard';
import { isDefined } from '../util/validationUtils';
import ControlHeader from './control/ControlHeader';
import PaginationContainer from './control/pagination/PaginationContainer';
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
const TestlabTable = <T extends object>({
  data,
  defaultColumns,
  displayError,
  actionRequiredError,
  loading = false,
  filterPreference = 'all',
  selectedRows = [],
  onSelectRows,
  onClickRow,
  onClickRetry,
  customStyle = {
    small: false,
  },
  rowActions,
}: TestlabTableProps<T>): ReactElement => {
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

  const fuzzyFilter: FilterFn<T> = (
    row: Row<T>,
    columnId: string,
    value: string,
    addMeta: (meta: FilterMeta) => void
  ) => {
    const itemRank: RankingInfo = rankItem(row.getValue(columnId), value, {
      threshold: rankings.CONTAINS,
    });

    addMeta({
      itemRank,
    });

    return itemRank.passed;
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
      globalFilter,
      rowSelection,
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
      <Table
        className={classnames('testlab-table__table', {
          'table-error': !!actionRequiredError,
        })}
      >
        <Table.Head>
          <Table.Row>
            {headerGroup.headers.map((header) => (
              <TestlabTableHeader<T>
                header={header}
                loading={isLoading}
                key={header.column.id}
              />
            ))}
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <TestlabTableBody<T>
            table={table}
            loading={isLoading}
            onClickCallback={onClickRow}
          />
        </Table.Body>
        <Table.Head>
          <Table.Row className="testlab-table__footer">
            <PaginationContainer table={table} loading={isLoading} />
          </Table.Row>
        </Table.Head>
      </Table>
      {actionRequiredError && (
        <ErrorMessage size="small">{actionRequiredError}</ErrorMessage>
      )}
    </div>
  );
};

export default TestlabTable;
