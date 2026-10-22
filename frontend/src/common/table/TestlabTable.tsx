import './testlabTable.scss';
import { ColumnDef, Row } from '@tanstack/react-table';

import TestlabTableBody from '@common/table/TestlabTableBody';
import { ErrorSummary, Table } from '@digdir/designsystemet-react';
import classnames from 'classnames';
import React, { ReactElement } from 'react';

import ErrorCard, { TestlabError } from '../error/ErrorCard';
import { isDefined } from '../util/validationUtils';
import ControlHeader from './control/ControlHeader';
import PaginationContainer from './control/pagination/PaginationContainer';
import TestlabTableHeader from './TestlabTableHeader';
import { TableFilterPreference, TableRowAction, TableStyle } from './types';
import { useTestlabTable } from './useTestlabTable';

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

const TestlabTable = <T extends object>({
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
  customStyle = { small: false },
  rowActions,
  classNames,
}: TestlabTableProps<T>): ReactElement => {
  const isLoading = loading ?? false;

  const {
    table,
    headerGroup,
    setPagination,
    rowSelectionEnabled,
    rowSelection,
    handleGlobalFilterChange,
    handleRetry,
  } = useTestlabTable({
    data,
    defaultColumns,
    selectedRows,
    onSelectRows,
    onClickRetry,
  });

  if (displayError?.error) {
    return (
      <ErrorCard
        errorHeader={displayError.errorHeader}
        error={displayError.error}
        onClick={displayError.onClick ?? handleRetry}
        buttonText={displayError.buttonText ?? 'Prøv igjen'}
      />
    );
  }

  return (
    <div className="testlab-table">
      <ControlHeader
        filterPreference={filterPreference ?? 'all'}
        table={table}
        onChangeFilter={handleGlobalFilterChange}
        small={customStyle?.small}
        rowActionEnabled={rowSelectionEnabled && isDefined(rowSelection)}
        rowActions={rowActions}
      />
      <Table
        className={classnames(classNames, 'testlab-table__table', {
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
        <Table.Foot>
          <Table.Row className="testlab-table__footer">
            <PaginationContainer
              table={table}
              loading={isLoading}
              paginationHander={setPagination}
            />
          </Table.Row>
        </Table.Foot>
      </Table>
      {actionRequiredError && (
        <ErrorSummary data-size="sm">{actionRequiredError}</ErrorSummary>
      )}
    </div>
  );
};

export default TestlabTable;
