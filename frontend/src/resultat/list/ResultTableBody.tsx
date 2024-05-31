import TableSkeleton from '@common/table/skeleton/TableSkeleton';
import { LoadingTableProps } from '@common/table/types';
import { Table } from '@digdir/designsystemet-react';
import { Cell, flexRender, Row } from '@tanstack/react-table';
import classnames from 'classnames';
import React from 'react';

export interface TableBodyProps<T> extends LoadingTableProps<T> {
  onClickCallback?: (row: Row<T>) => void;
  onClickRow?: (row: Row<T>, subRow: Row<T>) => void;
}

const ResultTableBody = <T extends object>({
  loading,
  table,
  onClickRow,
}: TableBodyProps<T>) => {
  if (loading) {
    return <TableSkeleton table={table} />;
  }

  const isSelectable = true;

  const setRowClass = (index: number): string => {
    if (index % 2 == 0) {
      return 'odd';
    }
    return 'even';
  };

  function filterLoeysingCells<T>(subRow: Row<T>) {
    return subRow.getVisibleCells().filter((cell) => {
      return !['namn', 'type', 'dato'].includes(cell.column.id);
    });
  }

  function filterKontrollCell<T>(row: Row<T>, index: number) {
    return row.getVisibleCells().filter((cell) => {
      return (
        (cell.column.id == 'namn' ||
          cell.column.id == 'type' ||
          cell.column.id == 'dato') &&
        index == 0
      );
    });
  }

  function onRowClick(row: Row<T>, subRow: Row<T>) {
    if (onClickRow) {
      onClickRow(row, subRow);
    }
  }

  function getRowClassName<T>(row: Row<T>) {
    return classnames(`testlab-table__row`, setRowClass(row.index), {
      selectable: isSelectable,
    });
  }

  function renderKontrollCellContent<T>(
    subRow: Row<T>,
    cell: Cell<T, unknown>
  ) {
    return subRow.index == 0
      ? flexRender(cell.column.columnDef.cell, cell.getContext())
      : '';
  }

  return (
    <>
      {table.getRowModel().rows.map(
        (row) =>
          row.subRows.length > 0 &&
          row.subRows.map((subRow) => (
            <Table.Row
              key={subRow.id}
              className={getRowClassName(row)}
              onClick={() => onRowClick(row, subRow)}
            >
              {filterKontrollCell(row, subRow.index).map((cell) => (
                <Table.Cell
                  key={cell.id}
                  id={cell.column.id}
                  rowSpan={row.subRows.length}
                >
                  {renderKontrollCellContent(subRow, cell)}
                </Table.Cell>
              ))}
              {filterLoeysingCells(subRow).map((cell) => (
                <Table.Cell key={cell.id} id={cell.column.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Table.Cell>
              ))}
            </Table.Row>
          ))
      )}
    </>
  );
};

export default ResultTableBody;
