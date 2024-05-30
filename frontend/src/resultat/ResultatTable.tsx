import '@common/table/testlabTable.scss';
import './resultat.scss';

import ErrorCard, { TestlabError } from '@common/error/ErrorCard';
import PaginationContainer from '@common/table/control/pagination/PaginationContainer';
import TestlabTableBody from '@common/table/TestlabTableBody';
import TestlabTableHeader from '@common/table/TestlabTableHeader';
import { Button, ErrorMessage, Table } from '@digdir/designsystemet-react';
import ResultatListTableBody from '@resultat/ResultatListTableBody';
import ResultTableHeader from '@resultat/ResultTableHeader';
import { resultTable } from '@resultat/tableoptions';
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  Row,
  RowModel,
  RowSelectionState,
  VisibilityState,
} from '@tanstack/react-table';
import classnames from 'classnames';
import React, { ReactElement, useState } from 'react';

export interface ResultTableProps<T extends object> {
  data: T[];
  defaultColumns: ColumnDef<T>[];
  displayError?: TestlabError;
  actionRequiredError?: string;
  loading?: boolean;
  selectedRows?: boolean[];
  onSelectRows?: (rows: T[]) => void;
  onClickRow?: (row?: Row<T>, subRow?: Row<T>) => void;
  onClickRetry?: () => void;
  visibilityState: (visDetaljer: boolean) => VisibilityState;
  topLevelList?: boolean;
  typeKontroll?: string;
  kontrollNamn?: string;
  loeysingNamn?: string;
  hasFilter?: boolean;
  subHeader?: string;
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
const ResultatTable = <T extends object>({
  data,
  defaultColumns,
  displayError,
  actionRequiredError,
  loading = false,
  selectedRows = [],
  onSelectRows,
  onClickRow,
  onClickRetry,
  visibilityState,
  topLevelList = false,
  typeKontroll,
  kontrollNamn,
  loeysingNamn,
  hasFilter = false,
  subHeader,
}: ResultTableProps<T>): ReactElement => {
  const [visDetaljer, setVisDetaljer] = React.useState<boolean>(false);

  const columns = [...defaultColumns];

  const showDetails = () => {
    setVisDetaljer(!visDetaljer);
    setColumnVisibility(visibilityState(visDetaljer));
  };

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(visibilityState(visDetaljer));

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    selectedRows.reduce((acc, b, index) => ({ ...acc, [index]: b }), {})
  );

  const rowSelectionEnabled = typeof onSelectRows !== 'undefined';

  const handleRowSelection = (rss: RowSelectionState) => {
    setRowSelection(rss);
  };

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

  const getOnSelectRows = (rowModel: RowModel<T>) => {
    if (rowSelectionEnabled) {
      onSelectRows?.(rowModel.flatRows.map((fr) => fr.original));
    }
  };
  getOnSelectRows(table.getSelectedRowModel());

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

  function getFilterColumns(): Column<T, unknown>[] | undefined {
    if (topLevelList && hasFilter) {
      const kontrollTypeColumn: Column<T, unknown> | undefined =
        table.getColumn('type');
      const dateColumn: Column<T, unknown> | undefined =
        table.getColumn('dato');
      if (kontrollTypeColumn && dateColumn) {
        return [kontrollTypeColumn, dateColumn];
      }
    }
  }

  const filterColumns = getFilterColumns();

  const headerGroup = table.getHeaderGroups()[0];

  return (
    <div className="testlab-table">
      <ResultTableHeader
        filterColumns={filterColumns}
        typeKontroll={typeKontroll}
        kontrollNamn={kontrollNamn}
        loeysingNamn={loeysingNamn}
        subHeader={subHeader}
      ></ResultTableHeader>
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
                loading={loading}
                key={header.column.id}
              />
            ))}
            <Table.HeaderCell>
              {topLevelList && (
                <Button onClick={showDetails} className="vis-detaljer">
                  {' '}
                  Vis detaljer
                </Button>
              )}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {topLevelList && (
            <ResultatListTableBody<T>
              table={table}
              loading={loading}
              onClickRow={onClickRow}
            />
          )}
          {!topLevelList && (
            <TestlabTableBody<T>
              table={table}
              loading={loading}
              onClickCallback={onClickRow}
            />
          )}
        </Table.Body>
        <Table.Head>
          <Table.Row className="testlab-table__footer">
            <PaginationContainer table={table} loading={loading} />
          </Table.Row>
        </Table.Head>
      </Table>
      {actionRequiredError && (
        <ErrorMessage size="small">{actionRequiredError}</ErrorMessage>
      )}
    </div>
  );
};

export default ResultatTable;
