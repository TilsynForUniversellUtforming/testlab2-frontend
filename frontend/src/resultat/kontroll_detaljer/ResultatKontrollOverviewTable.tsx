import '@common/table/testlabTable.scss';
import '../resultat.scss';

import ErrorCard, { TestlabError } from '@common/error/ErrorCard';
import PaginationContainer from '@common/table/control/pagination/PaginationContainer';
import TestlabTableHeader from '@common/table/TestlabTableHeader';
import {
  TableFilterPreference,
  TableRowAction,
  TableStyle,
} from '@common/table/types';
import { Button, ErrorMessage, Table } from '@digdir/designsystemet-react';
import ResultTableBody from '@resultat/list/ResultTableBody';
import { resultTable } from '@resultat/tableoptions';
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  RowSelectionState,
  VisibilityState,
} from '@tanstack/react-table';
import classnames from 'classnames';
import React, { ReactElement, useEffect, useState } from 'react';

// eslint-disable-next-line
export interface TestlabTableProps<T extends object> {
  data: T[];
  defaultColumns: ColumnDef<T>[];
  displayError?: TestlabError;
  actionRequiredError?: string;
  loading?: boolean;
  filterPreference?: TableFilterPreference;
  selectedRows?: boolean[];
  onSelectRows?: (rows: T[]) => void;
  onClickRow?: (row: Row<T>, subRow: Row<T>) => void;
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
const ResultatKontrollOverviewTable = <T extends object>({
  data,
  defaultColumns,
  displayError,
  actionRequiredError,
  loading = false,
  selectedRows = [],
  onSelectRows,
  onClickRow,
  onClickRetry,
}: TestlabTableProps<T>): ReactElement => {
  const isLoading = loading ?? false;
  const [columns, setColumns] = useState<typeof defaultColumns>(() => [
    ...defaultColumns,
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
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
  const [visDetaljer, setVisDetaljer] = React.useState<boolean>(false);

  const showDetails = () => {
    setColumnVisibility({
      talElementSamsvar: !visDetaljer,
      talElementBrot: !visDetaljer,
      id: false,
      loeysingId: false,
    });
    setVisDetaljer(!visDetaljer);
  };

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      talElementSamsvar: false,
      talElementBrot: false,
      id: false,
      loeysingId: false,
    });

  const table = resultTable(
    data,
    columns,
    columnFilters,
    rowSelection,
    columnVisibility,
    rowSelectionEnabled,
    handleRowSelection,
    setColumnFilters,
    setColumnVisibility
  );

  useEffect(() => {
    if (rowSelectionEnabled) {
      const selectedTableRows = table
        .getSelectedRowModel()
        .flatRows.map((fr) => fr.original);
      onSelectRows?.(selectedTableRows);
    }
  }, [rowSelection, rowSelectionEnabled]);

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
      <Table
        className={classnames('testlab-table__table', 'resultat-table', {
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
            <Table.HeaderCell colSpan={0}>
              <Button onClick={showDetails}> Vis detaljer</Button>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <ResultTableBody<T>
            table={table}
            loading={isLoading}
            onClickRow={onClickRow}
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

export default ResultatKontrollOverviewTable;
