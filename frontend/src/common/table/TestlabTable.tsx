import { HeaderGroup, Row, Table as TSTable } from '@tanstack/react-table';
import React from 'react';
import { Table } from '@digdir/designsystemet-react';
import classnames from 'classnames';
import TableSkeleton from '@common/table/skeleton/TableSkeleton';
import TestlabTableBody from '@common/table/TestlabTableBody';
import PaginationContainer from '@common/table/control/pagination/PaginationContainer';
import TestlabTableHeader from '@common/table/TestlabTableHeader';

function getHeaders<T extends object>(headerGroup: HeaderGroup<T>) {
  return headerGroup.headers;
}

function getRows<T>(table: TSTable<T>) {
  return table.getRowModel().rows;
}


interface TestlabTableProps<T> {
  classNames?: string[];
  actionRequiredError?: string;
  headerGroup: HeaderGroup<T>;
  loading: boolean;
  columnIsCheckBox: boolean[];
  onClickRow?: (row?: Row<T>) => void;
  table: TSTable<T>;
}

export const TestlabTable = <T extends object>( {
  classNames,
  actionRequiredError,
  headerGroup,
  loading,
  columnIsCheckBox,
  onClickRow,
  table
}: TestlabTableProps<T>) => {
  return (
    <Table
      className={classnames(classNames, 'testlab-table__table', {
        'table-error': !!actionRequiredError,
      })}
    >
      <Table.Head>
        <Table.Row>
          {getHeaders(headerGroup).map(
            (header) => (
              <TestlabTableHeader<T>
                header={header}
                loading={loading}
                key={header.column.id}
              />
            )
          )}
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {loading && (
          <TableSkeleton columnIsCheckBox={columnIsCheckBox} />
        )}
        {!loading && (
          <TestlabTableBody<T>
            onClickCallback={onClickRow}
            rows={getRows(table)}
          />
        )}
      </Table.Body>
      <Table.Foot>
        <Table.Row className="testlab-table__footer">
          <PaginationContainer table={table} loading={loading} />
        </Table.Row>
      </Table.Foot>
    </Table>
  );
};
