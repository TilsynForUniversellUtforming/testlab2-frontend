import TableSkeleton from '@common/table/skeleton/TableSkeleton';
import { LoadingTableProps } from '@common/table/types';
import { getFullPath, idPath } from '@common/util/routeUtils';
import { Table } from '@digdir/designsystemet-react';
import { TEST_RESULT_LIST, TEST_TESTING_LIST } from '@maaling/MaalingRoutes';
import { Cell, flexRender, Row } from '@tanstack/react-table';
import classnames from 'classnames';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export interface TableBodyProps<T> extends LoadingTableProps<T> {
  onClickCallback?: (row?: Row<T>) => void;
}

class ResultTableKontrollCell extends React.Component<{
  onClick: () => void;
  rowSpan: number;
  // eslint-disable-next-line
  cell: Cell<any, unknown>;
  subRowIndex: number;
}> {
  render() {
    return (
      <Table.Cell onClick={this.props.onClick} rowSpan={this.props.rowSpan}>
        {this.props.subRowIndex == 0
          ? flexRender(
              this.props.cell.column.columnDef.cell,
              this.props.cell.getContext()
            )
          : ''}
      </Table.Cell>
    );
  }
}

const ResultTableBody = <T extends object>({
  loading,
  table,
}: TableBodyProps<T>) => {
  if (loading) {
    return <TableSkeleton table={table} />;
  }

  const navigate = useNavigate();

  const isSelectable = true;

  const setRowClass = (index: number): string => {
    if (index % 2 == 0) {
      return 'odd';
    }
    return 'even';
  };

  function filterLoeysingCells<T>(subRow: Row<T>) {
    return subRow.getVisibleCells().filter((cell) => {
      return cell.column.id !== 'namn';
    });
  }

  function filterKontrollCell<T>(row: Row<T>, index: number) {
    return row.getVisibleCells().filter((cell) => {
      return cell.column.id == 'namn' && index == 0;
    });
  }

  const onClickRow = (kontrollType: string, kontrollId: string) => {
    if (kontrollType == 'forenkla-kontroll') {
      const path = getFullPath(TEST_TESTING_LIST, {
        pathParam: idPath,
        id: kontrollId,
      });
      navigate(path);
    } else navigate(String(kontrollId ?? ''));
  };

  const onClickRowDetails = (
    kontrollType: string,
    kontrollId: number,
    loeysingsId: number
  ) => {
    if (kontrollType == 'forenkla-kontroll') {
      const path = getFullPath(
        TEST_RESULT_LIST,
        {
          pathParam: idPath,
          id: String(kontrollId),
        },
        {
          pathParam: ':loeysingId',
          id: String(loeysingsId),
        }
      );

      navigate(path);
    } else navigate(String(kontrollId ?? ''));
  };

  function onClickKontroll<T>(row: Row<T>) {
    return () => onClickRow(row.getValue('type'), row.getValue('id'));
  }

  function onClickLoeysing<T>(row: Row<T>, loeysingsId: number) {
    return () =>
      onClickRowDetails(row.getValue('type'), row.getValue('id'), loeysingsId);
  }

  return (
    <>
      {table.getRowModel().rows.map(
        (row) =>
          row.subRows.length > 0 &&
          row.subRows.map((subRow) => (
            <Table.Row
              key={subRow.id}
              className={classnames(
                `testlab-table__row ${setRowClass(row.index)}`,
                {
                  selectable: isSelectable,
                }
              )}
            >
              {filterKontrollCell(row, subRow.index).map((cell) => (
                <ResultTableKontrollCell
                  key={cell.id}
                  onClick={onClickKontroll(row)}
                  rowSpan={row.subRows.length}
                  subRowIndex={subRow.index}
                  cell={cell}
                />
              ))}
              {filterLoeysingCells(subRow).map((cell) => (
                <Table.Cell
                  key={cell.id}
                  id={cell.column.id}
                  onClick={onClickLoeysing(row, subRow.getValue('id'))}
                >
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
