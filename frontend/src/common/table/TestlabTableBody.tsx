import { Table } from '@digdir/designsystemet-react';
import { flexRender, Row } from '@tanstack/react-table';
import classnames from 'classnames';
import React from 'react';

import TableSkeleton from './skeleton/TableSkeleton';
import { CellCheckboxId, LoadingTableProps } from './types';

export interface TableBodyProps<T> extends LoadingTableProps<T> {
  onClickCallback?: (row?: Row<T>) => void;
}

const TestlabTableBody = <T extends object>({
  loading,
  table,
  onClickCallback,
}: TableBodyProps<T>) => {
  if (loading) {
    return <TableSkeleton table={table} />;
  }

  const isSelectable = typeof onClickCallback !== 'undefined';

  const onRowClick = (row: Row<T>, isCheckbox: boolean) => {
    if (!isSelectable || isCheckbox) {
      return;
    } else {
      onClickCallback(row);
    }
  };

  return (
    <>
      {table.getRowModel().rows.map((row) => (
        <Table.Row
          key={row.id}
          className={classnames('testlab-table__row', {
            selectable: isSelectable,
          })}
        >
          {row.getVisibleCells().map((cell) => (
            <Table.Cell
              key={cell.id}
              onClick={() => onRowClick(row, cell.id.includes(CellCheckboxId))}
              tabIndex={0}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </Table.Cell>
          ))}
        </Table.Row>
      ))}
    </>
  );
};

export default TestlabTableBody;
