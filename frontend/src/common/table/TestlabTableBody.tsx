import { Table } from '@digdir/designsystemet-react';
import { Row } from '@tanstack/react-table';
import classnames from 'classnames';
import React from 'react';
import { TestlabTableCell } from '@common/table/TestlabTableCell';

export interface TableBodyProps<T>  {
  onClickCallback?: (row?: Row<T>) => void;
  rows:Row<T>[]
}

function getCells<T>(row: Row<T>) {
  return row.getVisibleCells();
}


const TestlabTableBody = <T extends object>({
  onClickCallback,
  rows
}: TableBodyProps<T>) => {
  const isSelectable = typeof onClickCallback !== 'undefined';
  return (
    <>
      {rows.map((row: Row<T>) => (
        <Table.Row
          key={row.id}
          className={classnames('testlab-table__row', {
            selectable: isSelectable,
          })}
        >
          {getCells(row).map((cell) => (
              <TestlabTableCell
                key={cell.id}
                cell={cell}
                onClickCallback={onClickCallback}
              />
            )
          )}
        </Table.Row>
      ))}
    </>
  );
};

export default TestlabTableBody;
